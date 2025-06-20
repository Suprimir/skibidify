import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { Moon, Save, Sun, X, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/theme";
import { useApiKeys } from "src/hooks/useApiKeys";
import type { ThemeAccent } from "@/types/Theme";

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ visible, onClose }: SettingsMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [showing, setShowing] = useState(false);
  const { setAccent, toggleMode, theme } = useTheme();
  const [showYouTubeKey, setShowYouTubeKey] = useState(false);
  const { setApiKey, getApiKey } = useApiKeys();

  const [youtubeInput, setYoutubeInput] = useState("");

  const [mode, accent] = theme.split("-");

  const accents: ThemeAccent[] = ["pink", "green"];

  const accentClasses: Record<ThemeAccent, string[]> = {
    pink: ["bg-pink-50", "bg-pink-200", "bg-pink-500", "bg-pink-800"],
    green: ["bg-green-50", "bg-green-200", "bg-green-500", "bg-green-800"],
    default: ["bg-slate-50", "bg-slate-200", "bg-slate-500", "bg-slate-800"],
  };

  const loadApiKeys = useCallback(async () => {
    const youtubeKey = await getApiKey("YouTube");

    if (youtubeKey) setYoutubeInput(youtubeKey);
  }, []);

  useEffect(() => {
    if (visible) {
      loadApiKeys();
      setMounted(true);
    } else {
      setShowing(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [visible, loadApiKeys]);

  useEffect(() => {
    if (mounted) {
      requestAnimationFrame(() => setShowing(true));
    }
  }, [mounted]);

  const handleSaveYoutube = async () => {
    if (youtubeInput.trim()) {
      setApiKey("YouTube", youtubeInput.trim());
    }
  };

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
          <h1 className="text-2xl font-semibold text-primary-600">Settings</h1>
          <button
            onClick={onClose}
            className="p-2 transition-transform rounded-xl hover:scale-110 hover:bg-primary-100"
          >
            <X className="w-8 h-8 text-primary-500" />
          </button>
        </div>
        <div className="flex flex-col gap-8 p-6 overflow-y-auto">
          <div>
            <h2 className="mb-3 text-lg font-medium text-primary-600">Mode</h2>
            <div className="flex">
              <button
                onClick={toggleMode}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg shadow-sm bg-primary-200 text-primary-700 hover:bg-primary-300"
                title="Change mode"
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
              Color Schemes
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

          <div>
            <h2 className="mb-3 text-lg font-medium text-primary-600">
              Services (API Keys)
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center bg-primary-50 rounded-lg shadow-sm border-2 border-transparent focus-within:border-primary-500 transition-all duration-200 hover:shadow-md">
                <div className="p-3 flex items-center gap-2 bg-primary-100 rounded-l-lg min-w-32 text-primary-700 font-medium border-r border-primary-200">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </div>
                <input
                  type={showYouTubeKey ? "text" : "password"}
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="Ingresa tu YouTube API Key"
                  className="flex-1 p-3 bg-transparent focus:outline-none text-primary-700 placeholder-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowYouTubeKey(!showYouTubeKey)}
                  className="cursor-pointer p-4 flex justify-center bg-primary-200 rounded-l-md text-primary-600 font-semibold hover:bg-primary-300 transition-colors"
                  aria-label={showYouTubeKey ? "Ocultar" : "Mostrar"}
                >
                  {showYouTubeKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleSaveYoutube}
                  className="cursor-pointer p-4 flex justify-center bg-primary-200 rounded-r-md text-primary-600 font-semibold hover:bg-primary-300 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Lo renderiza en el root del index.html para evitar problemas con los demas componentes en pantalla
    document.getElementById("root")!
  );
}
