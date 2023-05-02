import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Content from "./Content.jsx";

// TODO: change this so that the app renders right away in a hidden state, so it can begin listening to page load events and such. Then, when the page loads (and this mutation observer is triggered), find the element and move it to the "bottom-row" to replace the existing element
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
