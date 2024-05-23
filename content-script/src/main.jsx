import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

function placeContainerWhenAvailable() {
  const observer = new MutationObserver((mutations, obs) => {
    const targetContainer = document.getElementById("related");
    if (targetContainer) {
      console.log("Found target container, rendering app");
      const root = document.createElement("div");
      root.id = "inkling-root";
      // Insert the component as the first child of the target container
      targetContainer.insertBefore(root, targetContainer.firstChild);
      createRoot(root).render(<Content />);
      obs.disconnect(); // Stop observing once the element is found and the component is rendered
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Use DOMContentLoaded to start the observer, ensuring the document is ready
document.addEventListener("DOMContentLoaded", placeContainerWhenAvailable);
