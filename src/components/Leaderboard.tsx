"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: number;
  nickname: string;
  score: number;
  createdAt: string;
  user?: { id: number; email?: string } | null;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (!cancelled) setEntries(data.entries ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="w-full overflow-auto rounded-lg border border-white/10 bg-white/70 p-4 text-sm text-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <h2 className="text-lg font-semibold mb-3">Ranking</h2>
      <ol className="space-y-2">
        {entries.map((e, i) => (
          <li key={e.id} className="flex items-center justify-between rounded-md px-3 py-2 bg-white/60 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="font-semibold">#{i + 1}</span>
              <div>
                <div className="font-medium">{e.nickname}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{e.user?.email ?? "Gość"} • {new Date(e.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="text-sm font-semibold">{e.score}</div>
          </li>
        ))}
        {entries.length === 0 && <li>Brak wyników</li>}
      </ol>
    </div>
  );
}
