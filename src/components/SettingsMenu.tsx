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
  const { setAccent, toggleMode, theme } = useTheme();

  const [mode, accent] = theme.split("-");

  const accents: ThemeAccent[] = ["pink", "green"];

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!visible || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[70vw] max-w-3xl h-[70vh] bg-primary-100 shadow-xl rounded-2xl overflow-hidden flex flex-col">
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

          {/* Color Accent */}
          <div>
            <h2 className="mb-3 text-lg font-medium text-primary-600">
              Esquema de colores
            </h2>
            <div className="flex gap-6">
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
                        className={`w-1/2 h-full bg-${option.toString()}-50`}
                      />
                      <div
                        className={`w-1/2 h-full bg-${option.toString()}-200`}
                      />
                    </div>
                    <div className="flex flex-1">
                      <div
                        className={`w-1/2 h-full bg-${option.toString()}-500`}
                      />
                      <div
                        className={`w-1/2 h-full bg-${option.toString()}-800`}
                      />
                    </div>
                  </div>
                </button>
              ))}
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
                    <div className="`w-1/2 h-full bg-slate-50" />
                    <div className="w-1/2 h-full bg-slate-200" />
                  </div>
                  <div className="flex flex-1">
                    <div className="w-1/2 h-full bg-slate-500" />
                    <div className="w-1/2 h-full bg-slate-800" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
}
