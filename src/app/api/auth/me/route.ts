import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/server-auth";
import { repo } from "@/lib/repository";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: (user as any).role ?? "USER",
      nickname: (user as any).nickname ?? null,
      memory: repo.isMemory,
    },
  });
}

