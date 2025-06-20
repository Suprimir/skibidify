import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PlayerProvider } from "@/contexts/player";
import { ThemeProvider } from "@/contexts/theme";
import { SongProvider } from "@/contexts/song";
import { AlertProvider } from "@/contexts/alert";
import { DownloadProvider } from "@/contexts/download";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AlertProvider>
        <SongProvider>
          <DownloadProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </DownloadProvider>
        </SongProvider>
      </AlertProvider>
    </ThemeProvider>
  </StrictMode>
);
