import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PlayerContextProvider } from "@Contexts/PlayerContext.tsx";
import { ThemeProvider } from "@Contexts/ThemeContext.tsx";
import { SongProvider } from "@Contexts/SongContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SongProvider>
        <PlayerContextProvider>
          <App />
        </PlayerContextProvider>
      </SongProvider>
    </ThemeProvider>
  </StrictMode>
);
