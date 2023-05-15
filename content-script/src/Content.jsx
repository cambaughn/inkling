/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import TabButtons from "./TabButtons/TabButtons";
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
  const [videoDetails, setVideoDetails] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [videoSummary, setVideoSummary] = useState('');

  const tabs = ['Inkling', 'Description'];

  const handleChangeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };


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
      console.log('fetching video details');
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
      console.log('fetching summary')
      fetchSummary();
    }
  }, [videoDetails, subtitles]);

  // Reset state when videoId changes
  const resetState = () => {
    setActiveTab(0);
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

  useEffect(() => {
    // Send a message to the background script when the component has mounted
    chrome.runtime.sendMessage({ type: 'contentScriptMounted' });
  }, []);

  return (
    <div className={classNames('inkling-content', { visible: videoSummary?.length, expanded: isExpanded })}>
      <PreviewBar textContent={videoSummary} isExpanded={isExpanded} handleClick={handleBarClick} />

    {/* <TabButtons tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} key="inkling-button-row" /> */}
    {/* <Description currentTab={tabs[activeTab]} videoSummary={videoSummary} videoDescription={videoDescription} key="inkling-description" /> */}
    </div>
  );
}

export default Content;

// No english subtitles: https://www.youtube.com/watch?v=IKl2_5hBrjs

