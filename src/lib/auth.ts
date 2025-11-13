import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "bezpiesniowy_token";

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET must be set");
  }
  return secret;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signAuthToken(payload: AuthTokenPayload, expiresIn = "7d"): string {
  return jwt.sign(payload as any, getJwtSecret() as Secret, { expiresIn } as SignOptions);
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret() as Secret) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(header?: string | null): string | null {
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export function getTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get(TOKEN_COOKIE)?.value ?? null;
}

export { TOKEN_COOKIE };
