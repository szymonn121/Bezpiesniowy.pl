"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

interface Props {
  userEmail?: string | null;
  userRole?: string | null;
}

export default function MobileNav({ userEmail, userRole }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        aria-label="Menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-slate-900/60 p-2 text-white hover:bg-slate-900/80"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-16 z-50 rounded-lg border border-white/10 bg-slate-950/95 p-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            
            <Link href="/" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5">
              Gra
            </Link>
            <Link href="/leaderboard" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5">
              Ranking
            </Link>
            <Link href="/admin" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5">
              Panel admina
            </Link>
            {!userEmail && (
              <>
                <Link href="/login" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5">
                  Zaloguj się
                </Link>
                <Link href="/register" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5">
                  Zarejestruj
                </Link>
              </>
            )}

            {userEmail && (
              <div className="grid gap-2">
                <div className="px-3 py-2 text-sm text-slate-300">{userEmail}</div>
                <div className="px-3">{userRole === "ADMIN" ? <span className="text-xs text-emerald-400">Admin</span> : null}</div>
                <div className="px-3">
                  <LogoutButton />
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
