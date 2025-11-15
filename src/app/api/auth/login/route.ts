import { NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { signAuthToken, verifyPassword, TOKEN_COOKIE } from "@/lib/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dni

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email i hasło są wymagane" }, { status: 400 });
    }

    const user = await repo.findUserByEmail(email);
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
      role: (user as any).role ?? "USER",
    });

    const response = NextResponse.json({
      message: "Zalogowano pomyślnie",
      user: {
        id: user.id,
        email: user.email,
        role: (user as any).role ?? "USER",
      },
      token,
    });

    response.cookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.FORCE_INSECURE_COOKIES !== "true",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    if ((error as any)?.message?.includes("JWT_SECRET")) {
      return NextResponse.json({ message: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
    }
    if ((error as any)?.message?.includes("connect") || (error as any)?.message?.includes("database")) {
      return NextResponse.json({ message: "Database error: check DATABASE_URL and migrations" }, { status: 500 });
    }
    return NextResponse.json({ message: "Nie udało się zalogować" }, { status: 500 });
  }
}

