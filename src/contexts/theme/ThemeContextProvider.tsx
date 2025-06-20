import { useEffect, useState } from "react";
import { ThemeContext } from "./themeContext";
import type { Theme, ThemeAccent, ThemeMode } from "@/types/Theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /*
        States
  */
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light-default";
    }
    return "light-default";
  });

  const [mode, accent] = theme.split("-") as [ThemeMode, ThemeAccent];

  /*
        Funciónes
  */
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

  /*
        Effect para manejar el cambio de tema y asignacion
        al cargar la pagina.
  */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.remove("theme-pink", "theme-green", "theme-default");

    root.classList.add(mode);
    root.classList.add(`theme-${accent}`);

    localStorage.setItem("theme", theme);
  }, [theme, accent, mode]);

  const value = { theme, setTheme, toggleMode, setAccent };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
