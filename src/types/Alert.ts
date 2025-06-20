export type AlertType = "success" | "error";
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}
