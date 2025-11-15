import { NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nickname } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ message: "Email i hasło są wymagane" }, { status: 400 });
    }

    const existing = await repo.findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "Użytkownik o tym e-mailu już istnieje" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await repo.createUser({
      email,
      passwordHash,
      nickname: nickname ?? null,
    });

    // Provide clearer message when running in environments where cookies/JWT might be misconfigured
    return NextResponse.json({ message: "Rejestracja zakończona sukcesem", user: { id: user.id, email: user.email, nickname: (user as any).nickname ?? null } }, { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    // Helpful error for common Render misconfigurations
    if ((error as any)?.message?.includes("JWT_SECRET") || (error as any)?.message?.includes("JWT")) {
      return NextResponse.json({ message: "Server misconfiguration: JWT_SECRET missing or invalid" }, { status: 500 });
    }
    if ((error as any)?.message?.includes("connect") || (error as any)?.message?.includes("database")) {
      return NextResponse.json({ message: "Database error: check DATABASE_URL and migrations" }, { status: 500 });
    }
    return NextResponse.json({ message: "Nie udało się utworzyć konta" }, { status: 500 });
  }
}

