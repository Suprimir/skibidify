import { Download, Home, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "../SettingsMenu";
import { useState } from "react";

export default function TopBar() {
  const [settingsMenuVisible, setSettingsMenuVisible] =
    useState<boolean>(false);

  const handleSettingsMenu = () => {
    setSettingsMenuVisible(true);
  };

  const navigate = useNavigate();

  return (
    <div className="w-full border-b shadow-md bg-gradient-to-r from-primary-100 to-primary-100/90 border-primary-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center transition-all duration-200 border rounded-full shadow-sm bg-primary-200/70 hover:bg-primary-200/90 hover:shadow-md hover:scale-105 active:scale-95 border-primary-200/50"
        >
          <Home className="p-3 text-primary-600 w-13 h-13 group-hover:text-primary-700" />
        </button>

        <div className="flex items-center w-full max-w-2xl px-5 py-1 mx-4 transition-all duration-200 border rounded-full shadow-sm bg-primary-200/80 backdrop-blur-sm border-primary-200/50 hover:shadow-md">
          <form
            autoComplete="off"
            className="flex items-center w-full max-w-2xl"
          >
            <label
              htmlFor="searchBarInput"
              className="flex-shrink-0 p-1 rounded-full bg-primary-100/50"
            >
              <Search className="w-5 h-5 text-primary-600" />
            </label>
            <input
              id="searchBarInput"
              className="flex-1 py-2 pr-4 ml-4 text-lg font-medium bg-transparent border-r text-primary-800 placeholder-primary-400 focus:outline-none border-primary-400/50"
              placeholder="Search songs..."
              type="text"
            />
          </form>
          <button
            onClick={() => navigate("/download")}
            className="p-2 ml-4 transition-all duration-200 rounded-full bg-primary-100/50 hover:bg-primary-200/50 hover:scale-110 active:scale-95"
          >
            <Download className="w-5 h-5 text-primary-600" />
          </button>
        </div>
        <button
          onClick={handleSettingsMenu}
          className="flex items-center justify-center transition-all duration-200 border rounded-full shadow-sm bg-primary-200/70 hover:bg-primary-200/90 hover:shadow-md hover:scale-105 active:scale-95 border-primary-200/50"
        >
          <Settings className="p-3 text-primary-600 w-13 h-13 group-hover:text-primary-700" />
        </button>
      </div>

      <SettingsMenu
        visible={settingsMenuVisible}
        onClose={() => setSettingsMenuVisible(false)}
      />
    </div>
  );
}
