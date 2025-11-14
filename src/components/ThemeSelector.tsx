"use client";

import { useEffect, useState } from "react";

const THEMES = ["default", "dark", "solar", "teal"] as const;
export type ThemeName = typeof THEMES[number];

export default function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem("bp_theme");
      if (saved && THEMES.includes(saved as ThemeName)) return saved as ThemeName;
    } catch (e) {
      // ignore
    }
    // respect prefers-color-scheme
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "default";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("bp_theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-500">Motyw</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t === "default" ? "Jasny" : t === "dark" ? "Ciemny" : t === "solar" ? "Solar" : "Morski"}
          </option>
        ))}
      </select>
    </div>
  );
}
