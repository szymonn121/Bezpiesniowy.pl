import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Wylogowano" });
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

