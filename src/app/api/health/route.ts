import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const problems: string[] = [];

  // Check DB connectivity
  try {
    // simple lightweight query
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("Health check: DB error", err);
    problems.push("database connection error");
  }

  // Check env vars that are important for auth
  if (!process.env.JWT_SECRET) {
    problems.push("JWT_SECRET is not set");
  }
  if (!process.env.DATABASE_URL) {
    problems.push("DATABASE_URL is not set");
  }

  if (problems.length > 0) {
    return NextResponse.json({ ok: false, problems }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
