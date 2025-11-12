export const SNIPPET_DURATIONS_SECONDS = [0.5, 1, 2, 5, 10] as const;

export const STAGE_SCORES = [10, 8, 6, 4, 2] as const;

export function scoreForStage(stageIndex: number, attempts: number): number {
  const base = STAGE_SCORES[Math.min(stageIndex, STAGE_SCORES.length - 1)];
  const penalty = Math.max(attempts - 1, 0);
  return Math.max(base - penalty, 0);
}

export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildAcceptableAnswers(title: string, artist: string): string[] {
  const normalizedTitle = normalizeAnswer(title);
  const normalizedArtist = normalizeAnswer(artist);

  const combos = [
    normalizedTitle,
    `${normalizedArtist} ${normalizedTitle}`.trim(),
    `${normalizedTitle} ${normalizedArtist}`.trim(),
    `${normalizedArtist}-${normalizedTitle}`.trim(),
    `${normalizedTitle}-${normalizedArtist}`.trim(),
  ];

  return Array.from(new Set(combos.map(normalizeAnswer)));
}

