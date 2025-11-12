module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[project]/src/lib/game.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/app/api/songs/random/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    const total = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].song.count();
    if (total === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Brak piosenek w bazie"
        }, {
            status: 404
        });
    }
    const randomIndex = Math.floor(Math.random() * total);
    const song = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].song.findFirst({
        skip: randomIndex,
        orderBy: {
            id: "asc"
        }
    });
    if (!song) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Nie udało się wylosować piosenki"
        }, {
            status: 500
        });
    }
    const audioUrl = `/audio/${song.fileName}`;
    const hints = buildHints(song);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        // include title/artist so client can reveal the answer when user skips
        title: song.title,
        artist: song.artist,
        songId: song.id,
        audioUrl,
        hints,
        snippetDurations: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SNIPPET_DURATIONS_SECONDS"]
    });
}
function buildHints(song) {
    const hints = [];
    if (song.genre) {
        hints.push({
            stage: 1,
            label: "Gatunek",
            value: song.genre
        });
    }
    if (song.year) {
        hints.push({
            stage: 2,
            label: "Rok wydania",
            value: String(song.year)
        });
    }
    if (song.title) {
        hints.push({
            stage: 3,
            label: "Tytuł - pierwsza litera",
            value: `${song.title[0]?.toUpperCase() ?? "?"}…`
        });
    }
    if (song.artist) {
        hints.push({
            stage: 4,
            label: "Wykonawca - pierwsza litera",
            value: `${song.artist[0]?.toUpperCase() ?? "?"}…`
        });
    }
    return hints;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0b86f379._.js.map