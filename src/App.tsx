import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import "./App.css";
import Test from "./pages/Test";
import DownloadPage from "./pages/DownloadPage";
import LibraryPage from "./pages/LibraryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
