import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App";

createRoot(document.getElementById("inkling-popup-root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
