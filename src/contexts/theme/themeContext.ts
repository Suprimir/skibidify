import type { Theme, ThemeAccent } from "@/types/Theme";
import { createContext } from "react";

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
