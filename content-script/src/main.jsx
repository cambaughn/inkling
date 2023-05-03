import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Content from "./Content.jsx";

const container = document.createElement("div");
container.id = "bottom-row";

let placed = false;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const app = document.getElementById("bottom-row");
      if (app && !placed) {
        console.log('mounting app!');
        placed = true;
        observer.disconnect();
        app.id = "bottom-row";
        const root = createRoot(app);
        root.render(<Content />);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
