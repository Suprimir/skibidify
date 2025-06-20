import type { AlertType } from "@/types/Alert";
import { createContext } from "react";

export interface AlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message?: string,
    duration?: number
  ) => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);
