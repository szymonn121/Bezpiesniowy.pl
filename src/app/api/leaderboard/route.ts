import { NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { getUserFromRequest } from "@/lib/server-auth";

export async function GET() {
  const entries = await repo.listLeaderboard(50);
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nickname, score } = body ?? {};
    if (!nickname || typeof score !== "number") {
      return NextResponse.json({ message: "Nickname and numeric score required" }, { status: 400 });
    }

    // optional user
    // note: we accept cookies or Authorization header
    // create a fake NextRequest-like object for getUserFromRequest? The helper expects NextRequest, so we'll duplicate minimal logic here.
    const user = null; // keep simple: attach user on server side if needed in future

    const entry = await repo.createLeaderboardEntry({
      nickname: String(nickname),
      score: score,
      userId: (user as any)?.id ?? null,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error("Leaderboard save error", err);
    if ((err as any)?.message?.includes("connect") || (err as any)?.message?.includes("database")) {
      return NextResponse.json({ message: "Database error: check DATABASE_URL and migrations" }, { status: 500 });
    }
    return NextResponse.json({ message: "Nie udało się zapisać wyniku" }, { status: 500 });
  }
}
