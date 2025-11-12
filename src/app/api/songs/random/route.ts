import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SNIPPET_DURATIONS_SECONDS } from "@/lib/game";

export async function GET() {
  const total = await prisma.song.count();

  if (total === 0) {
    return NextResponse.json({ message: "Brak piosenek w bazie" }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * total);

  const song = await prisma.song.findFirst({
    skip: randomIndex,
    orderBy: { id: "asc" },
  });

  if (!song) {
    return NextResponse.json({ message: "Nie udało się wylosować piosenki" }, { status: 500 });
  }

  const audioUrl = `/audio/${song.fileName}`;
  const hints = buildHints(song);

  return NextResponse.json({
    // include title/artist so client can reveal the answer when user skips
    title: song.title,
    artist: song.artist,
    songId: song.id,
    audioUrl,
    hints,
    snippetDurations: SNIPPET_DURATIONS_SECONDS,
  });
}

function buildHints(song: {
  title: string;
  artist: string;
  genre: string | null;
  year: number | null;
}) {
  const hints = [];

  if (song.genre) {
    hints.push({ stage: 1, label: "Gatunek", value: song.genre });
  }

  if (song.year) {
    hints.push({ stage: 2, label: "Rok wydania", value: String(song.year) });
  }

  if (song.title) {
    hints.push({
      stage: 3,
      label: "Tytuł - pierwsza litera",
      value: `${song.title[0]?.toUpperCase() ?? "?"}…`,
    });
  }

  if (song.artist) {
    hints.push({
      stage: 4,
      label: "Wykonawca - pierwsza litera",
      value: `${song.artist[0]?.toUpperCase() ?? "?"}…`,
    });
  }

  return hints;
}

