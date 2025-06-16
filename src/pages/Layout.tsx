import { Outlet } from "react-router-dom";
import PlayerBar from "../components/Layout/PlayerBar";
import Sidebar from "../components/Layout/Sidebar";
import TopBar from "../components/Layout/TopBar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopBar - Fijado en la parte superior */}
      <div className="z-30 flex-shrink-0">
        <TopBar />
      </div>

      {/* Contenido - Sidebar + Outlet */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Fijado hacia la izquierda con colapso */}
        <div className="flex-shrink-0 relative z-30">
          <Sidebar />
        </div>

        {/* Outlet - Espacio disponible */}
        <main className="flex-1 overflow-auto bg-primary-50/90 relative z-10">
          <div className="h-full p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* PlayerBar - Fijado en parte inferior */}
      <div className="flex-shrink-0">
        <PlayerBar />
      </div>
    </div>
  );
}
