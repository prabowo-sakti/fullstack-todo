import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CekTimer from "./CekTimer.jsx";
import AutoFocusInput from "./UseRefFocus.jsx";

createRoot(document.getElementById("root")).render(
  <>
    {/* <CekTimer /> */}
    {/* <AutoFocusInput /> */}
    <App />
  </>
);
