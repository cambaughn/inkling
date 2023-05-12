import { getLoadingText } from "./util";
import Linkify from 'react-linkify';

function createDescriptionComponent(currentTab, videoSummary, videoDescription) {
  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("descriptionContainer");

  if (currentTab === 'Inkling' && videoSummary.length === 0) {
    const logoWrapper = document.createElement("div");
    logoWrapper.classList.add("logoWrapper");

    const logoImg = document.createElement("img");
    let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';
    logoImg.src = logoUrl;
    logoImg.alt = "Logo";
    logoImg.classList.add("logo-spin");
    logoWrapper.appendChild(logoImg);

    const loadingText = document.createElement("h3");
    const text = getLoadingText();
    loadingText.textContent = text;
    loadingText.classList.add("loadingText");
    logoWrapper.appendChild(loadingText);

    descriptionContainer.appendChild(logoWrapper);
  }

  if (currentTab === 'Inkling' && videoSummary.length > 0) {
    const linkify = document.createElement("div");
    linkify.innerHTML = videoSummary;
    descriptionContainer.appendChild(linkify);
  }

  if (currentTab === 'Description' && videoDescription?.details?.length > 0) {
    const descriptionDetails = document.createElement("div");
    descriptionDetails.classList.add("descriptionDetails");

    videoDescription.details.forEach(detail => {
      const span = document.createElement("span");
      span.textContent = detail;
      descriptionDetails.appendChild(span);
    });

    descriptionContainer.appendChild(descriptionDetails);
  }

  if (currentTab === 'Description' && videoDescription) {
    const linkify = document.createElement("div");
    linkify.innerHTML = videoDescription.description;
    descriptionContainer.appendChild(linkify);
  }

  return descriptionContainer;
}

export default createDescriptionComponent;