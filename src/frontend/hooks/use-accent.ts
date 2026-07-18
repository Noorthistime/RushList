"use client";

import { useState, useEffect, useCallback } from "react";

export type AccentColor =
  | "rose_pink"
  | "warmer_orange"
  | "nothing_red"
  | "ethereal_blue"
  | "emerald_green"
  | "contrast_grey";

export interface AccentOption {
  id: AccentColor;
  name: string;
  color: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: "rose_pink", name: "Rose Pink", color: "#f43f5e" },
  { id: "warmer_orange", name: "Warmer Orange", color: "#FF5722" },
  { id: "nothing_red", name: "Nothing Red", color: "#FF0031" },
  { id: "ethereal_blue", name: "Ethereal Blue", color: "#42A5F5" },
  { id: "emerald_green", name: "Emerald Green", color: "#2E7D32" },
  { id: "contrast_grey", name: "Contrast Grey", color: "#757575" },
];

export function useAccent() {
  const [accent, setAccentState] = useState<AccentColor>("rose_pink");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accent-color") as AccentColor | null;
    if (saved) {
      setAccentState(saved);
      document.documentElement.setAttribute("data-accent", saved);
    }
  }, []);

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem("accent-color", newAccent);
    document.documentElement.setAttribute("data-accent", newAccent);
  }, []);

  return { accent, setAccent, mounted };
}
