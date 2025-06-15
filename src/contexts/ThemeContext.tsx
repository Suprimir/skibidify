import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";
type ThemeAccent = "pink" | "green" | "default";
type Theme = `${ThemeMode}-${ThemeAccent}`;

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
  setAccent: (accent: ThemeAccent) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light-default",
  setTheme: () => {},
  toggleMode: () => {},
  setAccent: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light-default";
    }
    return "light-default";
  });

  const [mode, accent] = theme.split("-") as [ThemeMode, ThemeAccent];

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.remove("theme-pink", "theme-green", "theme-default");

    root.classList.add(mode);
    root.classList.add(`theme-${accent}`);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setThemeState(`${newMode}-${accent}` as Theme);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setThemeState(`${mode}-${newAccent}` as Theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
