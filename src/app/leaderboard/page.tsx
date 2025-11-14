import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-4">
        <h1 className="text-3xl font-semibold text-white">Ranking najlepszych wyników</h1>
        <p className="text-sm text-slate-300">Zobacz najlepsze wyniki zapisane przez graczy.</p>
      </section>

      <Leaderboard />
    </main>
  );
}
