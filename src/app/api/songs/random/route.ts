import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SNIPPET_DURATIONS_SECONDS } from "@/lib/game";
import { hasS3, s3PublicUrl } from "@/lib/s3";
import { cookies } from "next/headers";

export async function GET() {
  // Maintain a per-client queue of song IDs to avoid repeats
  const cookieStore = await cookies();
  const key = "song_queue";
  let queue: number[] = [];
  const raw = cookieStore.get(key)?.value ?? "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) queue = parsed.filter((n) => Number.isInteger(n));
  } catch {}

  if (queue.length === 0) {
    const ids = await prisma.song.findMany({ select: { id: true }, orderBy: { id: "asc" } });
    if (ids.length === 0) {
      return NextResponse.json({ message: "Brak piosenek w bazie" }, { status: 404 });
    }
    queue = shuffle(ids.map((s) => s.id));
  }

  const nextId = queue.shift() as number;

  const song = await prisma.song.findUnique({ where: { id: nextId } });
  if (!song) {
    return NextResponse.json({ message: "Nie udało się wylosować piosenki" }, { status: 500 });
  }

  const res = NextResponse.json({
    // include title/artist so client can reveal the answer when user skips
    title: song.title,
    artist: song.artist,
    songId: song.id,
    audioUrl: hasS3() ? s3PublicUrl(song.fileName) : `/audio/${song.fileName}`,
    hints: buildHints({
      title: song.title,
      artist: song.artist,
      genre: song.genre ?? null,
      year: song.year ?? null,
    }),
    snippetDurations: SNIPPET_DURATIONS_SECONDS,
  });

  // Persist updated queue in cookie
  res.cookies.set(key, JSON.stringify(queue), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // a week
    path: "/",
  });

  return res;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildHints(song: {
  title: string;
  artist: string;
  genre: string | null;
  year: number | null;
}) {
  const hints = [] as { stage: number; label: string; value: string }[];

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

