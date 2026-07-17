"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "virtueaze-theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts "dark" on every render (server and client) so hydration always
  // matches; the actual stored preference is read from localStorage only
  // after mount, same as the blocking <script> in the root layout already
  // did for the DOM attribute/CSS vars themselves.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from a browser-only API (localStorage) can't happen during render without breaking SSR hydration.
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/** Runs before hydration so a stored "light" preference doesn't flash dark first. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;
