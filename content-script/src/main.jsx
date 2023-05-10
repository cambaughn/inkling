import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";

let placed = false;
let observer = null; // Declare observer variable outside the scope

console.log("content script ======");

function mountApp() {
  const app = document.getElementById("bottom-row");
  console.log('Testing the observer...');
  const descriptionInner = document.getElementById('info-container');
  if (app && descriptionInner && !placed) {
    console.log('Mounting app!');
    placed = true;
    observer.disconnect();
    app.id = "bottom-row";
    const root = createRoot(app);
    root.render(<Content />);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'videoId' && !!request.data) {
    console.log('Received message for videoId ', request.data);
    // Perform actions when the videoId is received
    console.log('Received videoId: ', request.data);
    // Your code here...
    mountApp();
    
    if (!observer) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mountApp();
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
});
