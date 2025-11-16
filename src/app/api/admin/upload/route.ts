import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import * as mm from "music-metadata";
import { prisma } from "@/lib/prisma";
import { hasS3, putObject } from "@/lib/s3";
import { requireAdmin } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Brak dostępu" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Plik MP3 jest wymagany" }, { status: 400 });
  }

  const titleInput = formData.get("title")?.toString().trim();
  const artistInput = formData.get("artist")?.toString().trim();
  const albumInput = formData.get("album")?.toString().trim();
  const yearInput = formData.get("year")?.toString().trim();
  const genreInput = formData.get("genre")?.toString().trim();

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = buildFileName(file.name);
  const metadata = await readMetadata(buffer, file.type);

  let storedKeyOrName = fileName;
  if (hasS3()) {
    const key = `audio/${fileName}`;
    await putObject({ key, body: buffer, contentType: file.type || "audio/mpeg" });
    storedKeyOrName = key;
  } else {
    const uploadDir = path.join(process.cwd(), "public", "audio");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
  }

  const song = await prisma.song.create({
    data: {
      title: titleInput || metadata.title || "Nieznany tytuł",
      artist: artistInput || metadata.artist || "Nieznany wykonawca",
      album: albumInput || metadata.album,
      year:
        yearInput && yearInput.length > 0
          ? Number.isNaN(Number.parseInt(yearInput, 10))
            ? null
            : Number.parseInt(yearInput, 10)
          : metadata.year ?? null,
      genre: (genreInput && genreInput.length > 0 ? genreInput : metadata.genre) ?? null,
      durationSeconds: metadata.durationSeconds,
      fileName: storedKeyOrName,
    },
  });

  return NextResponse.json(
    {
      message: "Piosenka została dodana",
      song: {
        id: song.id,
        title: song.title,
        artist: song.artist,
        fileName: song.fileName,
      },
    },
    { status: 201 },
  );
}

function buildFileName(originalName: string): string {
  const timestamp = Date.now();
  const base = originalName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-.]/g, "");
  return `${timestamp}-${base || "audio"}`;
}

async function readMetadata(buffer: Buffer, mimeType: string) {
  try {
    const metadata = await mm.parseBuffer(buffer, mimeType);
    return {
      title: metadata.common.title ?? null,
      artist: metadata.common.artist ?? null,
      album: metadata.common.album ?? null,
      genre: metadata.common.genre?.[0] ?? null,
      year: metadata.common.year ?? null,
      durationSeconds: metadata.format.duration ?? null,
    };
  } catch (error) {
    console.warn("Nie udało się odczytać metadanych audio", error);
    return {
      title: null,
      artist: null,
      album: null,
      genre: null,
      year: null,
      durationSeconds: null,
    };
  }
}

