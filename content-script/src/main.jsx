import React from "react";
import { createRoot } from "react-dom";
import "./main.css";
import Content from "./Content.jsx";
import createDescriptionComponent from "./Description/Description.js";
import "./Description/Description.css";
import createButtonRow from "./ButtonRow/ButtonRow";

let observer;
let descriptionObserver;


console.log('Running main.jsx');

let placed = false;
observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const app = document.getElementById("bottom-row");

      console.log('Testing the app...', placed);

      if (app && !placed) {
        // Set the visibility of the description div to hidden
        const descriptionDiv = app.querySelector("#description");
        if (descriptionDiv) {
          descriptionDiv.style.display = "none";
        }
      }
      
      if (app && !placed) {
        console.log('Mounting app!');
        placed = true;
        observer.disconnect();
        app.id = "bottom-row";
        // place empty div in bottom-row
        console.log('appending child');
        const inkling = document.createElement("div");
        inkling.id = 'inkling';
        const buttonComponent = createButtonRow();
        inkling.appendChild(buttonComponent);
        let descriptionContainer = createDescriptionComponent("Inkling", '', '');
        inkling.appendChild(descriptionContainer);

        // const root = createRoot(app);
        // root.render(<Content />);
        app.appendChild(inkling);
      }
    }
  });
});

function placeContainerOnPage() {
  console.log('Starting mutation observer...');

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}


function startDescriptionObserver() {
  console.log('Starting description observer...');
  descriptionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        
        let descriptionObject = getDescriptionFromPage();

        if (descriptionObject?.description) {
          descriptionObserver.disconnect();
          const description = document.getElementById('inkling-description');
          description.innerHTML = descriptionObject.description;
        }
      }
    });
  });

  descriptionObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}




chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "startObserver") {
    resetState();
    placeContainerOnPage();
    startDescriptionObserver();
  }
});



// Get the video description and details from the page - so we don't have to format the raw data from the API
const getDescriptionFromPage = () => {
  const descriptionObject = {};

  // Fetch video details and update the description object
  const boldTextElements = document.querySelectorAll('.style-scope.yt-formatted-string.bold');
  const boldTextContentArray = Array.from(boldTextElements)
    .map(element => element.textContent.trim())
    .filter(text => !!text.length);
  descriptionObject.details = boldTextContentArray;

  const descriptionElement = document.querySelector('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');
  if (descriptionElement) {
    descriptionObject.description = descriptionElement.textContent;
  }

  return descriptionObject;
}


const resetState = () => {
  if (observer) {
    observer.disconnect();
  }
  if (descriptionObserver) {
    descriptionObserver.disconnect();
  }
}