import { createContext } from "react";

export interface AlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message?: string,
    duration?: number
  ) => void;
}

type AlertType = "success" | "error";

export const AlertContext = createContext<AlertContextType | null>(null);
