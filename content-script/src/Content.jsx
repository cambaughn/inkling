/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// import Logo from "./Logo";
import "./Content.css";
import { useEffect, useState } from "react";
import ButtonRow from "./ButtonRow/ButtonRow";
import Description from "./Description/Description";
// import Bar from "./Bar/Bar";
// import { findSubtitles } from "./util";

function Content({ videoId }) {
  // const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState('');
  const [videoDescription, setVideoDescription] = useState({});

  // Get the video description and details from the page - so we don't have to format the raw data from the API
  useEffect(() => {
    const descriptionObject = {};
  
    // Create a function to update the description object
    const updateDescriptionObject = () => {
      const boldTextElements = document.querySelectorAll('.style-scope.yt-formatted-string.bold');
      const boldTextContentArray = Array.from(boldTextElements).map(element => element.textContent.trim()).filter(text => !!text.length);
      descriptionObject.details = boldTextContentArray;
  
      // Get the main description
      const descriptionElement = document.querySelector('.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');
      if (descriptionElement) {
        descriptionObject.description = descriptionElement.textContent;
      }
  
      setVideoDescription(descriptionObject);
    };
  
    // Create a new MutationObserver and observe the body for changes
    const observer = new MutationObserver(updateDescriptionObject);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  
    // Call the update function initially to populate the state
    updateDescriptionObject();
  
    // Return a cleanup function to disconnect the observer
    return () => {
      observer.disconnect();
    };
  }, []);
  

  const tabs = ['Inkling', 'Description'];

  const handleChangeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const determineTabContent = () => {
    if (tabs[activeTab] === 'Inkling') {
      setContent(videoData?.gptResponse?.content);
    } else if (tabs[activeTab] === 'Description') {
      let videoDescription = videoData?.videoDetails?.snippet?.description;
      setContent(videoDescription);
    }
  }


  // Listen for video data from background.js
  useEffect(() => {
    // Add message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'videoData') {
        setVideoData(message.data);
      } else if (message.type === 'refreshDescription') {
        setVideoDescription({});
        setActiveTab(0);
      }
    });

    // Clean up by removing message listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener();
    };
  }, []);

  useEffect(determineTabContent, [videoData, activeTab]);

  return (
    <div className="App" id="inkling">
      <ButtonRow tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} />
      <Description currentTab={tabs[activeTab]} inklingContent={videoData?.gptResponse} videoDescription={videoDescription} />
    </div>
  );
}

export default Content;
