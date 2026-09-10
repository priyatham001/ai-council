/**
 * KrishiSetu — Global Theme Context
 *
 * Single source of truth for Light/Dark theme, mirroring LanguageContext.tsx.
 * Before this file existed, theme was tracked as two independent useState
 * instances (LandingOnboardingFlow.tsx and KrishiWorkflow.tsx) that each read
 * 'krishi_theme' from localStorage once on mount and toggled
 * document.documentElement's 'dark' class on their own. That worked by
 * accident most of the time (the class lives on <html>, so it survives route
 * changes untouched) but meant there was no single place to change or read
 * theme from, no toggle available outside those two screens, and any future
 * page had no way to participate. This context replaces both local copies.
 *
 * localStorage key: 'krishi_theme' (unchanged, so existing saved values from
 * before this fix keep working).
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const LS_KEY = 'krishi_theme';

function applyThemeClass(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Keep <html class="dark"> in sync with state. main.tsx already applies the
  // saved theme before first paint (avoids a flash); this effect keeps it in
  // sync thereafter, including on every subsequent change.
  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(LS_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
