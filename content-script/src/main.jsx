import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

const hiddenContainer = document.createElement("div");
hiddenContainer.style.display = "none"; // Hide the container initially
document.body.appendChild(hiddenContainer);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const app = document.getElementById("bottom-row");
      // console.log('Testing the app...');
      
      if (app) {
        console.log('Mounting app!');
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

// Render <Content /> to the hidden container on page load
const root = createRoot(hiddenContainer);
root.render(<Content />);
