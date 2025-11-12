import { buildAcceptableAnswers, normalizeAnswer, scoreForStage } from "@/lib/game";

describe("normalizeAnswer", () => {
  it("removes diacritics and punctuation", () => {
    expect(normalizeAnswer("Zaśpiewaj żółtą gęś!")).toBe("zaspiewaj zolta ges");
  });

  it("collapses whitespace", () => {
    expect(normalizeAnswer("  Maanam   -   Cykady  ")).toBe("maanam cykady");
  });
});

describe("buildAcceptableAnswers", () => {
  it("generates combinations of artist and title", () => {
    const answers = buildAcceptableAnswers("Cykady na Cykladach", "Maanam");
    expect(answers).toContain("cykady na cykladach");
    expect(answers).toContain("maanam cykady na cykladach");
  });
});

describe("scoreForStage", () => {
  it("returns base score for early stage", () => {
    expect(scoreForStage(0, 1)).toBe(10);
    expect(scoreForStage(1, 1)).toBe(8);
  });

  it("applies penalty for additional attempts", () => {
    expect(scoreForStage(2, 3)).toBe(4); // base 6 - penalty 2
  });

  it("never returns negative score", () => {
    expect(scoreForStage(4, 10)).toBe(0);
  });
});

