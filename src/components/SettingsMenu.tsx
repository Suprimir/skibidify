import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Moon, Sun, X } from "lucide-react";
import { useTheme } from "@Contexts/ThemeContext";

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
}
type ThemeAccent = "pink" | "green" | "default";

export default function SettingsMenu({ visible, onClose }: SettingsMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [showing, setShowing] = useState(false);
  const { setAccent, toggleMode, theme } = useTheme();

  const [mode, accent] = theme.split("-");

  const accents: ThemeAccent[] = ["pink", "green"];

  const accentClasses: Record<ThemeAccent, string[]> = {
    pink: ["bg-pink-50", "bg-pink-200", "bg-pink-500", "bg-pink-800"],
    green: ["bg-green-50", "bg-green-200", "bg-green-500", "bg-green-800"],
    default: ["bg-slate-50", "bg-slate-200", "bg-slate-500", "bg-slate-800"],
  };

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      setShowing(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    if (mounted) {
      requestAnimationFrame(() => setShowing(true));
    }
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center 
    bg-black/40 backdrop-blur-sm transition-opacity duration-300
    ${showing ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`w-[70vw] max-w-3xl h-[70vh] bg-primary-100 shadow-xl rounded-2xl overflow-hidden flex flex-col
      transform transition-all duration-300
      ${showing ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-primary-200 border-primary-300">
          <h1 className="text-2xl font-semibold text-primary-600">
            Configuración
          </h1>
          <button
            onClick={onClose}
            className="p-2 transition-transform rounded-xl hover:scale-110 hover:bg-primary-100"
          >
            <X className="w-8 h-8 text-primary-500" />
          </button>
        </div>
        <div className="flex flex-col gap-8 p-6 overflow-y-auto">
          <div>
            <h2 className="mb-3 text-lg font-medium text-primary-600">Modo</h2>
            <div className="flex">
              <button
                onClick={toggleMode}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg shadow-sm bg-primary-200 text-primary-700 hover:bg-primary-300"
                title="Cambiar modo"
              >
                {mode === "light" ? (
                  <>
                    <Moon className="w-5 h-5" /> Oscuro
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5" /> Claro
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Esquemas de colores */}
          <div>
            <h2 className="mb-3 text-lg font-medium text-primary-600">
              Esquema de colores
            </h2>
            <div className="flex gap-6">
              <button
                onClick={() => setAccent("default")}
                className={`w-16 h-16 p-1 rounded-xl border-2 transition-all shadow-sm ${
                  accent === "default"
                    ? "border-slate-500 scale-105"
                    : "border-transparent"
                }`}
              >
                <div className="flex flex-col w-full h-full overflow-hidden rounded-md">
                  <div className="flex flex-1">
                    <div className="w-1/2 h-full bg-slate-50" />
                    <div className="w-1/2 h-full bg-slate-300" />
                  </div>
                  <div className="flex flex-1">
                    <div className="w-1/2 h-full bg-slate-500" />
                    <div className="w-1/2 h-full bg-slate-800" />
                  </div>
                </div>
              </button>
              {accents.map((option) => (
                <button
                  key={option.toString()}
                  onClick={() => setAccent(option)}
                  className={`w-16 h-16 p-1 rounded-xl border-2 transition-all shadow-sm ${
                    accent === option.toString()
                      ? "border-primary-500 scale-105"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex flex-col w-full h-full overflow-hidden rounded-md">
                    <div className="flex flex-1">
                      <div
                        className={`w-1/2 h-full ${accentClasses[option][0]}`}
                      />
                      <div
                        className={`w-1/2 h-full ${accentClasses[option][1]}`}
                      />
                    </div>
                    <div className="flex flex-1">
                      <div
                        className={`w-1/2 h-full ${accentClasses[option][2]}`}
                      />
                      <div
                        className={`w-1/2 h-full ${accentClasses[option][3]}`}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Lo renderiza en el root del index.html para evitar problemas con los demas componentes en pantalla
    document.getElementById("root")!
  );
}
