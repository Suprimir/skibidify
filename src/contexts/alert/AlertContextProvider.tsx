import { createPortal } from "react-dom";
import { AlertContext } from "./alertContext";
import { CheckCircle, X, XCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Alert, AlertType } from "@/types/Alert";

const randomUUID = () => {
  return crypto.randomUUID();
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  /*
        States
  */
  const [alerts, setAlerts] = useState<Alert[]>([]);

  /*
        Funciónes
  */
  const showAlert = (
    type: AlertType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const newAlert: Alert = {
      id: randomUUID(),
      type,
      title,
      message,
      duration: duration ?? 5000,
    };

    setAlerts((prev) => [...prev, newAlert]);

    if (newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        hideAlert(newAlert.id);
      }, newAlert.duration);
    }
  };

  const hideAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const AlertContainer = () => {
    if (alerts.length === 0) return null;

    return createPortal(
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border-l-4 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-primary-50 border-primary-200 text-primary-600 animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-start gap-3">
              {alert.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-primary-600" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 text-primary-600" />
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                {alert.message && (
                  <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                )}
              </div>

              <button
                onClick={() => hideAlert(alert.id)}
                className="flex-shrink-0 p-1 rounded-md hover:bg-primary-600 transition-colors"
                aria-label="Cerrar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>,
      document.body
    );
  };

  const value = { showAlert };
  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};
