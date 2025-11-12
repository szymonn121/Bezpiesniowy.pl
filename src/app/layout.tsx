import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCurrentUserFromCookies } from "@/lib/server-auth";
import { LogoutButton } from "@/components/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bezpieśniowy · Zgadnij polską piosenkę",
  description:
    "Bezpieśniowy to quiz muzyczny, w którym zgadujesz polskie piosenki po krótkich fragmentach audio. Własna baza MP3, lokalne odtwarzanie, panel administracyjny i JWT auth.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserFromCookies();

  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-950/95 text-slate-100 antialiased">
        <div className="relative isolate flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-base font-bold text-white shadow-lg">
                  B
                </span>
                <span>Bezpieśniowy</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-slate-200">
                <Link href="/" className="transition hover:text-white">
                  Gra
                </Link>
                <Link href="/admin" className="transition hover:text-white">
                  Panel admina
                </Link>
                {!user && (
                  <Link
                    href="/login"
                    className="rounded-full border border-emerald-400 px-4 py-1.5 text-emerald-300 transition hover:bg-emerald-500/10"
                  >
                    Zaloguj się
                  </Link>
                )}
                {user && (
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-slate-400 sm:block">
                      {user.email} {user.role === "ADMIN" ? "(admin)" : ""}
                    </span>
                    <LogoutButton />
                  </div>
                )}
              </nav>
            </div>
          </header>
          <main className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-16">
            {children}
          </main>
          <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-sm text-slate-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>© {new Date().getFullYear()} Bezpieśniowy. Projekt edukacyjny.</p>
              <p>
                Pamiętaj o prawach autorskich. Wgrywaj jedynie pliki, do których masz uprawnienia
                licencyjne.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
