import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

let placed = false;
let observer;



console.log('Running main.jsx');
function startMutationObserver() {
  console.log('Starting mutation observer...');
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const app = document.getElementById("bottom-row");
        console.log('Testing the app...');
        const descriptionInner = document.getElementById('description-inner');
        if (app && descriptionInner && !placed) {
          console.log('Mounting app!');
          placed = true;
          observer.disconnect();
          app.id = "bottom-row";
          // place empty div in bottom-row
          console.log('appending child');
          const div = document.createElement("div");
          div.id = 'lskdfjdlksfjkl'
          app.appendChild(div);
          // const root = createRoot(app);
          // root.render(<Content />);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

startMutationObserver();


chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "startObserver") {
    startMutationObserver();
  }
});