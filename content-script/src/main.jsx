import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

let placed = false;
let observer;


if (!placed) {
  console.log("rendering app");
  const root = document.createElement("div");
  root.id = "inkling-root";
  document.body.appendChild(root);
  createRoot(root).render(<Content />);
  placed = true;
}


