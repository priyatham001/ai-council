import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('krishi_theme');
    if (saved === 'dark') return 'dark';
    return 'light'; // Default setting: Light Mode as specified
  });

  const applyTheme = (t: Theme) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('krishi_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode: theme === 'dark',
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
