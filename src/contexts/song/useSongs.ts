import { useContext } from "react";
import { SongContext } from "./songContext";

export const useSongs = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSongs must be used within SongProvider");
  return context;
};
