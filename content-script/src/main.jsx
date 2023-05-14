import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

let placed = false;
let observer;

const renderApp = () => {
  if (!placed) {
    const root = document.createElement("div");
    root.id = "inkling-root";
    document.body.appendChild(root);
    createRoot(root).render(<Content />);
    placed = true;
  }
};




chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "renderApp") {
    renderApp();
  }
});