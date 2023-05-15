/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import ButtonRow from "./ButtonRow/ButtonRow";
import Description from "./Description/Description";
import PreviewBar from "./PreviewBar/PreviewBar";
import classNames from "classnames";
// Util
import { getVideoDetails, getYouTubeSubtitles } from "../util/youTube";
import { getSummary } from "../util/openAI";


function Content() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [videoDescription, setVideoDescription] = useState({});
  const [videoDetails, setVideoDetails] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [videoSummary, setVideoSummary] = useState('');


  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
      setVideoSummary("In this video, we go over the technical details of the Red Epic camera. The Red Epic is a high-end digital cinema camera known for its exceptional image quality and advanced features. We dive deep into its specifications, exploring the camera's sensor resolution, dynamic range, and color science. We discuss the various recording formats and frame rates supported by the Red Epic, as well as its workflow and post-production requirements. Whether you're a professional cinematographer or an enthusiast interested in filmmaking, this video provides an in-depth analysis of the Red Epic camera's technical capabilities.");
    }, 1000);
  }, []);

  const handleBarClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Whenever the videoId changes, get the new video details
  useEffect(() => {
    async function fetchVideoDetails() {
      const details = await getVideoDetails(videoId);
      setVideoDetails(details);
    }    
    
    async function fetchSubtitles() {
      const transcript = await getYouTubeSubtitles(videoId);
      setSubtitles(transcript);
    }

    if (videoId && !videoDetails && !subtitles) {
      fetchVideoDetails();
      fetchSubtitles();
    }
  }, [videoId]);

  // When videoDetails and subtitles are available, send them to openAI for the summary 
  useEffect(() => {
    async function fetchSummary() {
      const gptSummary = await getSummary(videoDetails, subtitles);
      setVideoSummary(gptSummary);
    }    

    if (videoDetails && subtitles && !videoSummary) {
      fetchSummary();
    }
  }, [videoDetails, subtitles]);

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

  const resetState = () => {
    setActiveTab(0);
    setVideoDescription({});
    setVideoDetails(null);
    setSubtitles('');
    setVideoSummary('');
  };

  // Listen for messages from background.js
  useEffect(() => {
    // Add message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'videoId' && message.data !== videoId) { // if there are changes to the videoId
        resetState();
        setVideoId(message.data);
        console.log('setting video id ', message.data);
      }
    });

    // Clean up by removing message listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener();
    };
  }, []);

  // In your Content.js file
  useEffect(() => {
    // Send a message to the background script when the component has mounted
    chrome.runtime.sendMessage({ type: 'contentScriptMounted' });
  }, []);

  return (
    <div className={classNames('inkling-content', { visible: isVisible, expanded: isExpanded })}>
    <div onClick={handleBarClick}>
      <PreviewBar textContent={videoSummary} isExpanded={isExpanded} />
    </div>
    Testing
      {/* <ButtonRow tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} key="inkling-button-row" />
      <Description currentTab={tabs[activeTab]} videoSummary={videoSummary} videoDescription={videoDescription} key="inkling-description" /> */}
    </div>
  );
}

export default Content;

// No english subtitles: https://www.youtube.com/watch?v=IKl2_5hBrjs

