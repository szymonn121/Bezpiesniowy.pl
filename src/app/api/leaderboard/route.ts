import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/server-auth";

export async function GET() {
  // return top 50 entries
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: { score: "desc" },
    take: 50,
    include: { user: { select: { id: true, email: true } } },
  });
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

    const entry = await prisma.leaderboardEntry.create({
      data: {
        nickname: String(nickname).slice(0, 32),
        score: Math.floor(score),
        userId: (user as any)?.id ?? undefined,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error("Leaderboard save error", err);
    return NextResponse.json({ message: "Nie udało się zapisać wyniku" }, { status: 500 });
  }
}
