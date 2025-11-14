"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Nie udało się zarejestrować");
      }

      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/50 p-8 shadow-2xl backdrop-blur">
      <div className="grid gap-3 text-sm text-slate-200">
        <label className="grid gap-2">
          <span>Adres e-mail</span>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2">
          <span>Nick (widoczny w rankingu)</span>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="Twój nick"
          />
        </label>

        <label className="grid gap-2">
          <span>Hasło</span>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="Hasło"
          />
        </label>

        <div className="text-sm text-center">
          <p className="text-xs text-slate-400">Rejestracja jest opcjonalna — możesz grać jako gość.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? "Rejestracja..." : "Zarejestruj się"}
        </button>

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="text-center text-sm">
          <span className="text-slate-400">Masz już konto? </span>
          <a className="text-emerald-300 hover:text-emerald-400" href="/login">Zaloguj się</a>
        </div>
      </div>
    </form>
  );
}
