"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SNIPPET_DURATIONS_SECONDS } from "@/lib/game";

type Hint = {
  stage: number;
  label: string;
  value: string;
};

type SongChallenge = {
  songId: number;
  audioUrl: string;
  hints: Hint[];
  snippetDurations: number[];
};

const FALLBACK_DURATIONS = SNIPPET_DURATIONS_SECONDS.map((value) => Number(value));

function formatDurationLabel(duration: number) {
  if (duration < 1) {
    return `${Math.round(duration * 10) / 10} s`;
  }
  return `${duration} s`;
}

interface GuessResult {
  correct: boolean;
  score: number;
  message: string;
  answer?: {
    title: string;
    artist: string;
  };
}

export function AudioGuessGame() {
  const [challenge, setChallenge] = useState<SongChallenge | null>(null);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [guess, setGuess] = useState("");
  const [loadingChallenge, setLoadingChallenge] = useState(false);
  const [feedback, setFeedback] = useState<GuessResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<GuessResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageBeingPlayed, setStageBeingPlayed] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const durations = useMemo(
    () => challenge?.snippetDurations ?? FALLBACK_DURATIONS,
    [challenge?.snippetDurations],
  );

  const resetAudio = useCallback(() => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setStageBeingPlayed(null);
  }, []);

  useEffect(() => {
    return () => {
      resetAudio();
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current.load();
      }
    };
  }, [resetAudio]);

  const loadChallenge = useCallback(async () => {
    setLoadingChallenge(true);
    setError(null);
    setFeedback(null);
    setGuess("");
    setAttempts(0);
    setMaxUnlockedStage(0);
    resetAudio();

    try {
      const response = await fetch("/api/songs/random");
      const data = (await response.json().catch(() => ({}))) as Partial<SongChallenge> & {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message ?? "Nie udało się pobrać piosenki");
      }
      if (!data.songId || !data.audioUrl) {
        throw new Error("Brak danych o piosence");
      }
      setChallenge({
        songId: data.songId,
        audioUrl: data.audioUrl,
        hints: data.hints ?? [],
        snippetDurations: data.snippetDurations ?? FALLBACK_DURATIONS,
        // include title/artist from API so we can show correct answer on skip
        // @ts-ignore
        title: data.title ?? undefined,
        // @ts-ignore
        artist: data.artist ?? undefined,
      } as any);
      if (audioRef.current) {
        audioRef.current.src = "";
      }
      // Ensure absolute URL (helps when basePath or origin matters)
      const audioUrl = typeof window !== "undefined" && data.audioUrl?.startsWith("/") ? `${window.location.origin}${data.audioUrl}` : data.audioUrl;
      const audio = new Audio(audioUrl as string);
      audioRef.current = audio;
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setStageBeingPlayed(null);
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoadingChallenge(false);
    }
  }, [resetAudio]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handlePlayStage = useCallback(
    async (stageIndex: number) => {
      if (!challenge || stageIndex > maxUnlockedStage) {
        return;
      }

      try {
        resetAudio();

        const audio = audioRef.current ?? new Audio(challenge.audioUrl);
        if (!audioRef.current) {
          audioRef.current = audio;
        } else if (!audioRef.current.src.includes(challenge.audioUrl)) {
          audioRef.current.src = challenge.audioUrl;
          audioRef.current.load();
        }

        setIsPlaying(true);
        setStageBeingPlayed(stageIndex);

        audio.currentTime = 0;
        await audio.play();

        const duration = durations[stageIndex] ?? FALLBACK_DURATIONS[stageIndex] ?? 2;

        playTimeoutRef.current = setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
          setStageBeingPlayed(null);
          setMaxUnlockedStage((prev) => Math.max(prev, stageIndex + 1));
        }, duration * 1000);
      } catch (err) {
        console.error("Audio play error", err);
        setError("Nie udało się odtworzyć fragmentu. Spróbuj ponownie.");
        resetAudio();
      }
    },
    [challenge, durations, maxUnlockedStage, resetAudio],
  );

  const submitGuess = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!challenge || !guess.trim()) {
        return;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError(null);

      try {
        const response = await fetch("/api/songs/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId: challenge.songId,
            guess,
            stageIndex: Math.max(maxUnlockedStage - 1, 0),
            attempts: nextAttempts,
          }),
        });

        const result = (await response.json()) as GuessResult;
        setFeedback(result);

        if (!response.ok) {
          setError(result.message ?? "Błąd podczas sprawdzania odpowiedzi");
          return;
        }

        if (result.correct) {
          setTotalScore((prev) => prev + result.score);
          setStreak((prev) => prev + 1);
          setHistory((prev) => [
            {
              ...result,
              message: `${result.message} (${result.answer?.artist ?? ""} – ${result.answer?.title ?? ""})`,
            },
            ...prev,
          ]);
          resetAudio();
        } else {
          setStreak(0);
        }
      } catch (err) {
        console.error("Guess submit error", err);
        setError("Coś poszło nie tak. Spróbuj ponownie za chwilę.");
      }
    },
    [attempts, challenge, guess, maxUnlockedStage, resetAudio],
  );

  const handleNextSong = useCallback(() => {
    loadChallenge();
  }, [loadChallenge]);

  const canAdvance = challenge && maxUnlockedStage < durations.length;

  return (
    <section className="grid gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition dark:border-white/5 dark:bg-slate-900/70">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Zgadnij utwór
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Odtwarzaj coraz dłuższe fragmenty (0.5s → 10s), zgadnij tytuł piosenki i zdobywaj punkty.
        </p>
        {error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">{error}</p>}
      </header>

      <div className="grid gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Fragmenty audio
        </h3>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          {durations.map((duration, index) => {
            const unlocked = index <= maxUnlockedStage;
            const active = stageBeingPlayed === index;
            return (
              <button
                key={duration}
                type="button"
                onClick={() => handlePlayStage(index)}
                disabled={!unlocked || isPlaying}
                className={`w-full sm:w-auto rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-emerald-500 bg-emerald-500 text-white shadow"
                    : unlocked
                      ? "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-300"
                      : "cursor-not-allowed border-slate-300 text-slate-400 opacity-60 dark:border-slate-700"
                }`}
              >
                {formatDurationLabel(duration)}
              </button>
            );
          })}
        </div>
        {canAdvance && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aby odblokować kolejny fragment, odsłuchaj obecny do końca.
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Dostępne wskazówki
        </h3>
        <div className="grid gap-2">
          {challenge?.hints
            ?.filter((hint) => maxUnlockedStage >= hint.stage)
            .map((hint) => (
              <div
                key={hint.label}
                className="flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
              >
                <span className="font-medium">{hint.label}</span>
                <span>{hint.value}</span>
              </div>
            ))}
          {!challenge?.hints?.some((hint) => maxUnlockedStage >= hint.stage) && (
            <p className="rounded-lg border border-dashed border-slate-400/50 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              Odsłuchaj dłuższy fragment, aby odblokować wskazówki.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={submitGuess} className="grid gap-3">
        <label className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Twoja odpowiedź
        </label>
        <input
          type="text"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="np. Cykady na Cykladach"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          disabled={feedback?.correct}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!guess.trim() || !!feedback?.correct}
            className="w-full sm:w-auto rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:opacity-60"
          >
            Sprawdź odpowiedź
          </button>
          {feedback?.correct && (
            <button
              type="button"
              onClick={handleNextSong}
              disabled={loadingChallenge}
              className="w-full sm:w-auto rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-300"
            >
              Następna piosenka
            </button>
          )}
          {!feedback?.correct && (
            <button
              type="button"
              onClick={() => {
                // reveal correct answer for current challenge
                if (challenge) {
                  setFeedback({
                    correct: false,
                    score: 0,
                    message: "Pominięto — oto poprawna odpowiedź:",
                    answer: {
                      title: (challenge as any).title ?? "",
                      artist: (challenge as any).hints?.length ? ((challenge as any).hints.find((h:any)=>h.label.includes('Wykonawca'))?.value ?? '') : '' ,
                    },
                  });
                }
                resetAudio();
              }}
              disabled={loadingChallenge}
              className="w-full sm:w-auto rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Pomiń utwór
            </button>
          )}
        </div>
      </form>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.correct
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-red-500/50 bg-red-500/10 text-red-700 dark:bg-red-500/10 dark:text-red-200"
          }`}
        >
          <p className="font-semibold">{feedback.message}</p>
          {feedback.answer && (
            <p className={`text-xs ${feedback.correct ? 'text-emerald-600 dark:text-emerald-200/80' : 'text-slate-700 dark:text-slate-200/80'}`}>
              Poprawna odpowiedź: {feedback.answer.artist} – {feedback.answer.title}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Próby: {attempts}</p>
          {feedback.correct && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Zdobyte punkty: {feedback.score}</p>
          )}
        </div>
      )}

      <footer className="grid gap-3 rounded-xl border border-slate-200/60 bg-slate-100/80 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-slate-500 dark:text-slate-400">Łączny wynik</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">{totalScore}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase text-slate-500 dark:text-slate-400">Seria</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">{streak}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase text-slate-500 dark:text-slate-400">Próby w tej rundzie</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">{attempts}</span>
          </div>
        </div>
        {history.length > 0 && (
          <div className="grid gap-2">
            <span className="text-xs uppercase text-slate-500 dark:text-slate-400">Ostatnie trafienia</span>
            <ul className="grid gap-2 text-xs text-slate-600 dark:text-slate-300">
              {history.slice(0, 3).map((item, index) => (
                <li key={`${item.message}-${index}`} className="rounded-lg border border-slate-200/60 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60">
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </section>
  );
}

