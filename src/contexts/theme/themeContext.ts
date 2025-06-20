import { createContext } from "react";

type ThemeMode = "light" | "dark";
type ThemeAccent = "pink" | "green" | "default";
type Theme = `${ThemeMode}-${ThemeAccent}`;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
  setAccent: (accent: ThemeAccent) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light-default",
  setTheme: () => {},
  toggleMode: () => {},
  setAccent: () => {},
});
