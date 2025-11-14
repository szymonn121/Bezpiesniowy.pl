import Link from "next/link";
import { AudioGuessGame } from "@/components/AudioGuessGame";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <section className="grid gap-8 rounded-3xl border border-white/20 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent p-10 shadow-2xl backdrop-blur-sm dark:border-white/5 dark:from-emerald-500/20">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-center">
          <div className="grid gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Bezpieśniowy
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Zgaduj piosenki po coraz dłuższych fragmentach audio
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-200">
              Wyzwanie dla uszu i pamięci muzycznej. Odsłuchuj krótkie próbki 0.5s, 1s, 2s, 5s i 10s,
              porównuj z ulubionymi przebojami i zdobywaj punkty. Całość działa lokalnie – wystarczy baza
              Twoich plików MP3.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#gra"
                className="w-full sm:w-auto rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 text-center"
              >
                Rozpocznij grę
              </Link>
              <Link
                href="/admin"
                className="w-full sm:w-auto rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-300 text-center"
              >
                Panel admina
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/60 p-6 text-sm text-slate-600 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Jak to działa?</h2>
            <ul className="mt-4 space-y-3">
              <li>1. Administrator dodaje lokalne pliki MP3 z metadanymi.</li>
              <li>2. Gra losuje utwór i udostępnia kolejne fragmenty audio.</li>
              <li>3. Zdobywasz punkty za szybkie odgadnięcie tytułu.</li>
              <li>4. Możesz grać jako gość lub po zalogowaniu zapisywać wyniki.</li>
            </ul>
          </div>
        </div>
        <p className="rounded-2xl border border-amber-500/30 bg-amber-100/70 px-5 py-4 text-sm text-amber-800 shadow-sm dark:border-amber-400/30 dark:bg-amber-900/40 dark:text-amber-100">
          <strong>Uwaga prawna:</strong> wgrywaj wyłącznie pliki, do których posiadasz prawa lub licencję.
          Projekt służy do użytku prywatnego i edukacyjnego. Odpowiadasz za zgodność z prawem autorskim.
        </p>
      </section>

      <section id="gra" className="pb-16">
        <AudioGuessGame />
      </section>
    </main>
  );
}
