module.exports = [
"[project]/src/lib/game.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SNIPPET_DURATIONS_SECONDS",
    ()=>SNIPPET_DURATIONS_SECONDS,
    "STAGE_SCORES",
    ()=>STAGE_SCORES,
    "buildAcceptableAnswers",
    ()=>buildAcceptableAnswers,
    "normalizeAnswer",
    ()=>normalizeAnswer,
    "scoreForStage",
    ()=>scoreForStage
]);
const SNIPPET_DURATIONS_SECONDS = [
    0.5,
    1,
    2,
    5,
    10
];
const STAGE_SCORES = [
    10,
    8,
    6,
    4,
    2
];
function scoreForStage(stageIndex, attempts) {
    const base = STAGE_SCORES[Math.min(stageIndex, STAGE_SCORES.length - 1)];
    const penalty = Math.max(attempts - 1, 0);
    return Math.max(base - penalty, 0);
}
function normalizeAnswer(answer) {
    return answer.trim().toLowerCase().normalize("NFD").replace(/ł/g, "l").replace(/Ł/g, "l").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}
function buildAcceptableAnswers(title, artist) {
    const normalizedTitle = normalizeAnswer(title);
    const normalizedArtist = normalizeAnswer(artist);
    const combos = [
        normalizedTitle,
        `${normalizedArtist} ${normalizedTitle}`.trim(),
        `${normalizedTitle} ${normalizedArtist}`.trim(),
        `${normalizedArtist}-${normalizedTitle}`.trim(),
        `${normalizedTitle}-${normalizedArtist}`.trim()
    ];
    return Array.from(new Set(combos.map(normalizeAnswer)));
}
}),
"[project]/src/components/AudioGuessGame.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioGuessGame",
    ()=>AudioGuessGame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const FALLBACK_DURATIONS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SNIPPET_DURATIONS_SECONDS"].map((value)=>Number(value));
function formatDurationLabel(duration) {
    if (duration < 1) {
        return `${Math.round(duration * 10) / 10} s`;
    }
    return `${duration} s`;
}
function AudioGuessGame() {
    const [challenge, setChallenge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [maxUnlockedStage, setMaxUnlockedStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [attempts, setAttempts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [guess, setGuess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loadingChallenge, setLoadingChallenge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [feedback, setFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [totalScore, setTotalScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [streak, setStreak] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stageBeingPlayed, setStageBeingPlayed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const playTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const durations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>challenge?.snippetDurations ?? FALLBACK_DURATIONS, [
        challenge?.snippetDurations
    ]);
    const resetAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            resetAudio();
            if (audioRef.current) {
                audioRef.current.src = "";
                audioRef.current.load();
            }
        };
    }, [
        resetAudio
    ]);
    const loadChallenge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoadingChallenge(true);
        setError(null);
        setFeedback(null);
        setGuess("");
        setAttempts(0);
        setMaxUnlockedStage(0);
        resetAudio();
        try {
            const response = await fetch("/api/songs/random");
            const data = await response.json().catch(()=>({}));
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
                artist: data.artist ?? undefined
            });
            if (audioRef.current) {
                audioRef.current.src = "";
            }
            const audio = new Audio(data.audioUrl);
            audioRef.current = audio;
            audio.addEventListener("ended", ()=>{
                setIsPlaying(false);
                setStageBeingPlayed(null);
            });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Nieznany błąd");
        } finally{
            setLoadingChallenge(false);
        }
    }, [
        resetAudio
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadChallenge();
    }, [
        loadChallenge
    ]);
    const handlePlayStage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (stageIndex)=>{
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
            playTimeoutRef.current = setTimeout(()=>{
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
                setStageBeingPlayed(null);
                setMaxUnlockedStage((prev)=>Math.max(prev, stageIndex + 1));
            }, duration * 1000);
        } catch (err) {
            console.error("Audio play error", err);
            setError("Nie udało się odtworzyć fragmentu. Spróbuj ponownie.");
            resetAudio();
        }
    }, [
        challenge,
        durations,
        maxUnlockedStage,
        resetAudio
    ]);
    const submitGuess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (event)=>{
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    songId: challenge.songId,
                    guess,
                    stageIndex: Math.max(maxUnlockedStage - 1, 0),
                    attempts: nextAttempts
                })
            });
            const result = await response.json();
            setFeedback(result);
            if (!response.ok) {
                setError(result.message ?? "Błąd podczas sprawdzania odpowiedzi");
                return;
            }
            if (result.correct) {
                setTotalScore((prev)=>prev + result.score);
                setStreak((prev)=>prev + 1);
                setHistory((prev)=>[
                        {
                            ...result,
                            message: `${result.message} (${result.answer?.artist ?? ""} – ${result.answer?.title ?? ""})`
                        },
                        ...prev
                    ]);
                resetAudio();
            } else {
                setStreak(0);
            }
        } catch (err) {
            console.error("Guess submit error", err);
            setError("Coś poszło nie tak. Spróbuj ponownie za chwilę.");
        }
    }, [
        attempts,
        challenge,
        guess,
        maxUnlockedStage,
        resetAudio
    ]);
    const handleNextSong = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        loadChallenge();
    }, [
        loadChallenge
    ]);
    const canAdvance = challenge && maxUnlockedStage < durations.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "grid gap-6 rounded-2xl border border-white/10 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition dark:border-white/5 dark:bg-slate-900/70",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold tracking-tight text-slate-900 dark:text-white",
                        children: "Zgadnij polski utwór"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-600 dark:text-slate-300",
                        children: "Odtwarzaj coraz dłuższe fragmenty (0.5s → 10s), zgadnij tytuł piosenki i zbieraj punkty."
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-md bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 244,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
                        children: "Fragmenty audio"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: durations.map((duration, index)=>{
                            const unlocked = index <= maxUnlockedStage;
                            const active = stageBeingPlayed === index;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handlePlayStage(index),
                                disabled: !unlocked || isPlaying,
                                className: `rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-emerald-500 bg-emerald-500 text-white shadow" : unlocked ? "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-300" : "cursor-not-allowed border-slate-300 text-slate-400 opacity-60 dark:border-slate-700"}`,
                                children: formatDurationLabel(duration)
                            }, duration, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 256,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    canAdvance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500 dark:text-slate-400",
                        children: "Aby odblokować kolejny fragment, odsłuchaj obecny do końca."
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
                        children: "Dostępne wskazówki"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-2",
                        children: [
                            challenge?.hints?.filter((hint)=>maxUnlockedStage >= hint.stage).map((hint)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: hint.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/AudioGuessGame.tsx",
                                            lineNumber: 293,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: hint.value
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/AudioGuessGame.tsx",
                                            lineNumber: 294,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, hint.label, true, {
                                    fileName: "[project]/src/components/AudioGuessGame.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this)),
                            !challenge?.hints?.some((hint)=>maxUnlockedStage >= hint.stage) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-lg border border-dashed border-slate-400/50 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400",
                                children: "Odsłuchaj dłuższy fragment, aby odblokować wskazówki."
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 298,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: submitGuess,
                className: "grid gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
                        children: "Twoja odpowiedź"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: guess,
                        onChange: (event)=>setGuess(event.target.value),
                        placeholder: "np. Cykady na Cykladach",
                        className: "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                        disabled: feedback?.correct
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !guess.trim() || !!feedback?.correct,
                                className: "rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 disabled:opacity-60",
                                children: "Sprawdź odpowiedź"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            feedback?.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleNextSong,
                                disabled: loadingChallenge,
                                className: "rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-300",
                                children: "Następna piosenka"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 326,
                                columnNumber: 13
                            }, this),
                            !feedback?.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    // reveal correct answer for current challenge
                                    if (challenge) {
                                        setFeedback({
                                            correct: false,
                                            score: 0,
                                            message: "Pominięto — oto poprawna odpowiedź:",
                                            answer: {
                                                title: challenge.title ?? "",
                                                artist: challenge.hints?.length ? challenge.hints.find((h)=>h.label.includes('Wykonawca'))?.value ?? '' : ''
                                            }
                                        });
                                    }
                                    resetAudio();
                                },
                                disabled: loadingChallenge,
                                className: "rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                                children: "Pomiń utwór"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 336,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            feedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `rounded-xl border px-4 py-3 text-sm ${feedback.correct ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" : "border-red-500/50 bg-red-500/10 text-red-700 dark:bg-red-500/10 dark:text-red-200"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold",
                        children: feedback.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 370,
                        columnNumber: 11
                    }, this),
                    feedback.answer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs ${feedback.correct ? 'text-emerald-600 dark:text-emerald-200/80' : 'text-slate-700 dark:text-slate-200/80'}`,
                        children: [
                            "Poprawna odpowiedź: ",
                            feedback.answer.artist,
                            " – ",
                            feedback.answer.title
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 372,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-slate-600 dark:text-slate-300",
                        children: [
                            "Próby: ",
                            attempts
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this),
                    feedback.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-slate-600 dark:text-slate-300",
                        children: [
                            "Zdobyte punkty: ",
                            feedback.score
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 378,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 363,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "grid gap-3 rounded-xl border border-slate-200/60 bg-slate-100/80 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/60",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs uppercase text-slate-500 dark:text-slate-400",
                                        children: "Łączny wynik"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 386,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-semibold text-slate-900 dark:text-white",
                                        children: totalScore
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 387,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 385,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs uppercase text-slate-500 dark:text-slate-400",
                                        children: "Seria"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 390,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-semibold text-slate-900 dark:text-white",
                                        children: streak
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs uppercase text-slate-500 dark:text-slate-400",
                                        children: "Próby w tej rundzie"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 394,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-semibold text-slate-900 dark:text-white",
                                        children: attempts
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this),
                    history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs uppercase text-slate-500 dark:text-slate-400",
                                children: "Ostatnie trafienia"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 400,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "grid gap-2 text-xs text-slate-600 dark:text-slate-300",
                                children: history.slice(0, 3).map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "rounded-lg border border-slate-200/60 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60",
                                        children: item.message
                                    }, `${item.message}-${index}`, false, {
                                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                                        lineNumber: 403,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AudioGuessGame.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AudioGuessGame.tsx",
                        lineNumber: 399,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AudioGuessGame.tsx",
                lineNumber: 383,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AudioGuessGame.tsx",
        lineNumber: 236,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_6424d2c4._.js.map