import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nickname } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ message: "Email i hasło są wymagane" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Użytkownik o tym e-mailu już istnieje" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname: nickname ?? null,
      },
    });

    return NextResponse.json({ message: "Rejestracja zakończona sukcesem" }, { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ message: "Nie udało się utworzyć konta" }, { status: 500 });
  }
}

