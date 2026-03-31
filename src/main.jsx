import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
