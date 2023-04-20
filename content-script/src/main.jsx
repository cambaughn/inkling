import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Content from "./Content.jsx";

// const body = document.querySelector("body");

// const app = document.createElement("div");

// app.id = "root";

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time

// if (body) {
//   body.prepend(app);
// }

// const app = document.getElementById("bottom-row") || document.createElement("div");
// app.id = "bottom-row";


// // const container = document.getElementById("root");
// const container = app;
// const root = createRoot(container);

// root.render(<Content />);


// document.addEventListener("DOMContentLoaded", () => {
//   console.log('dom content loaded -------------')
//   const app = document.getElementById("bottom-row") || document.createElement("div");
//   app.id = "bottom-row";
//   const container = app;
//   const root = createRoot(container);
//   root.render(<Content />);
// });

// window.onload = function() {
//   console.log('dom content loaded -------------')
//   const app = document.getElementById("bottom-row") || document.createElement("div");
//   app.id = "bottom-row";
//   const container = app;
//   const root = createRoot(container);
//   root.render(<Content />);
// }

let rendered = false;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const app = document.getElementById("bottom-row");
      if (app && !rendered) {
        rendered = true;
        observer.disconnect();
        app.id = "bottom-row";
        const container = app;
        const root = createRoot(container);
        root.render(<Content />);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});