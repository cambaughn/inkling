import React from "react";
import ReactDOM, { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

let placed = false;
let observer;
let root;


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
          root = createRoot(app);
          setTimeout(() => {
            ReactDOM.render(<Content />, app);
          }, 0);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}



chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "startObserver") {
    startMutationObserver();
  }
});