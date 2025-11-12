import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Wylogowano" });
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}

