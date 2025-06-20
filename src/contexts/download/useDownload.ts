import { useContext } from "react";
import { DownloadContext } from "./downloadContext";

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error(
      "useDownload debe usarse dentro de <DownloadContextProvider>"
    );
  }
  return context;
};
