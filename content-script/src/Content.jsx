/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// import Logo from "./Logo";
import "./Content.css";
import { useEffect, useState } from "react";
import ButtonRow from "./ButtonRow/ButtonRow";
import Description from "./Description/Description";
// Util
import { getVideoDetails, getYouTubeSubtitles } from "../util/youTube";
import { getSummary } from "../util/openAI";


function Content() {
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [videoDescription, setVideoDescription] = useState({});
  const [videoDetails, setVideoDetails] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [videoSummary, setVideoSummary] = useState('');

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

  // Listen for messages from background.js
  useEffect(() => {
    // Add message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'videoId') { // if there are changes to the videoId
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

  console.log('summary ----- ', videoSummary.length, subtitles.length, videoDetails);
  return (
    <div className="App" id="inkling">
      <ButtonRow tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} key="inkling-button-row" />
      <Description currentTab={tabs[activeTab]} videoSummary={videoSummary} videoDescription={videoDescription} key="inkling-description" />
    </div>
  );
}

export default Content;
