import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { TOKEN_COOKIE, extractTokenFromHeader, getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export async function getUserFromRequest(request: NextRequest) {
  const headerToken = extractTokenFromHeader(request.headers.get("authorization"));
  const cookieToken = getTokenFromCookies(request);
  const token = headerToken ?? cookieToken;

  if (!token) return null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}

export async function requireAdmin(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

// 🧩 uniwersalna wersja getCurrentUserFromCookies
export async function getCurrentUserFromCookies(req?: any) {
  let token: string | undefined;

  try {
    // Próba użycia App Router API
    const { cookies } = await import("next/headers");
    // `cookies()` is async in this Next.js runtime and must be awaited
    const cookieStore = await cookies();
    token = cookieStore.get(TOKEN_COOKIE)?.value;
  } catch {
    // Fallback dla Pages Router (req.cookies)
    token = req?.cookies?.[TOKEN_COOKIE];
  }

  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}
