import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";
import { repo } from "@/lib/repository";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Brak dostępu" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const nickname = body?.nickname?.toString().trim();
    const score = Number(body?.score ?? 0);

    if (!nickname || nickname.length === 0) {
      return NextResponse.json({ message: "Nickname jest wymagany" }, { status: 400 });
    }

    if (!Number.isInteger(score) || score < 0) {
      return NextResponse.json({ message: "Wynik musi być liczbą całkowitą >= 0" }, { status: 400 });
    }

    const entry = await repo.createLeaderboardEntry({
      nickname,
      score,
      userId: null,
    });

    return NextResponse.json(
      {
        message: "Dodano wpis do leaderboardu",
        entry: {
          id: (entry as any).id,
          nickname: entry.nickname,
          score: entry.score,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add leaderboard entry error", error);
    return NextResponse.json({ message: "Nie udało się dodać wpisu" }, { status: 500 });
  }
}
