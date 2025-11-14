"use client";

import { useState, useEffect } from "react";

interface Props {
  score: number;
  onSaved?: (entryId: number) => void;
}

export default function SaveScore({ score, onSaved }: Props) {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data?.user?.nickname) {
          setNickname(data.user.nickname);
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname || "Anon", score }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Error");
      setMessage("Wynik zapisany");
      setNickname("");
      onSaved?.(data.entry?.id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Błąd");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 grid gap-2">
      <label className="text-sm text-slate-600 dark:text-slate-300">Zapisz swój wynik</label>
      <div className="flex gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Twój nick"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white dark:bg-slate-900"
        />
        <button
          onClick={save}
          disabled={loading}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Zapisz
        </button>
      </div>
      {message && <p className="text-xs text-slate-600">{message}</p>}
    </div>
  );
}
