"use client";

import React from "react";

export default function StartGameButton() {
  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById("gra");
    // compute header height to offset the sticky header
    const header = document.querySelector("header");
    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

    if (!target) {
      // fallback to hash navigation
      window.location.hash = "#gra";
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Rozpocznij grę"
      className="w-full sm:w-auto rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow transition-transform transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      Rozpocznij grę
    </button>
  );
}
