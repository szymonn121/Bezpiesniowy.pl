import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildAcceptableAnswers, normalizeAnswer, scoreForStage } from "@/lib/game";
import { getUserFromRequest } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songId, guess, stageIndex, attempts = 1 } = body ?? {};

    if (!songId || !guess || stageIndex === undefined) {
      return NextResponse.json({ message: "Brak wymaganych danych" }, { status: 400 });
    }

    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) {
      return NextResponse.json({ message: "Nie znaleziono piosenki" }, { status: 404 });
    }

    const normalizedGuess = normalizeAnswer(guess);
    const acceptable = buildAcceptableAnswers(song.title, song.artist);
    const isCorrect = acceptable.some((answer) => answer === normalizedGuess);

    const score = isCorrect ? scoreForStage(stageIndex, attempts) : 0;

    const user = await getUserFromRequest(request);

    await prisma.guessSession.create({
      data: {
        userId: user?.id,
        songId: song.id,
        isCorrect,
        attempts,
        score,
      },
    });

    return NextResponse.json({
      correct: isCorrect,
      score,
      message: isCorrect ? "Brawo! To poprawna odpowiedź." : "Niestety, spróbuj ponownie.",
      answer: isCorrect ? { title: song.title, artist: song.artist } : undefined,
    });
  } catch (error) {
    console.error("Guess error", error);
    return NextResponse.json({ message: "Nie udało się sprawdzić odpowiedzi" }, { status: 500 });
  }
}

