import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAuthToken, verifyPassword, TOKEN_COOKIE } from "@/lib/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dni

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email i hasło są wymagane" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Niepoprawne dane logowania" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Niepoprawne dane logowania" }, { status: 401 });
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Zalogowano pomyślnie",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });

    response.cookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ message: "Nie udało się zalogować" }, { status: 500 });
  }
}

