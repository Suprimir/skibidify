import { useContext } from "react";
import { AlertContext } from "./alertContext";

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe usarse dentro de <AlertContextProvider>");
  }
  return context;
};
