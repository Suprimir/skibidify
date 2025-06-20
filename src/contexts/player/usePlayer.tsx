import { useContext } from "react";
import { PlayerContext } from "./playerContext";

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer debe usarse dentro de <PlayerContextProvider>");
  }
  return context;
}
