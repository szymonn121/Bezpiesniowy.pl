import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Brak dostępu" }, { status: 401 });
  }

  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    songs: songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      genre: song.genre,
      fileName: song.fileName,
      durationSeconds: song.durationSeconds,
    })),
  });
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Brak dostępu" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const id = Number(body?.id ?? NaN);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ message: "Nieprawidłowe id" }, { status: 400 });
    }

    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      return NextResponse.json({ message: "Utwór nie istnieje" }, { status: 404 });
    }

    // delete file from disk (if exists)
    try {
      const filePath = path.join(process.cwd(), "public", "audio", song.fileName);
      await fs.unlink(filePath).catch(() => null);
    } catch (err) {
      // ignore file system errors, continue with DB delete
      console.warn("Nie udało się usunąć pliku audio:", err);
    }

    // Remove related GuessSession rows first (foreign key)
    await prisma.guessSession.deleteMany({ where: { songId: id } });

    await prisma.song.delete({ where: { id } });

    return NextResponse.json({ message: "Utwór usunięty" });
  } catch (error) {
    console.error("Delete song error", error);
    return NextResponse.json({ message: "Nie udało się usunąć utworu" }, { status: 500 });
  }
}

