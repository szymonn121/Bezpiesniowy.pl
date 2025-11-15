import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const songs = await prisma.song.findMany({ select: { title: true, artist: true }, orderBy: { title: "asc" } });
    const titles = songs.map((s) => `${s.artist} – ${s.title}`);
    return NextResponse.json({ titles });
  } catch (err) {
    return NextResponse.json({ titles: [] });
  }
}
