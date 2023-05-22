import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App.jsx";

console.log("Hello from main.jsx!");

createRoot(document.getElementById("inkling-popup-container")!).render(
  <App />
);
