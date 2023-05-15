/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import TabButtons from "./TabButtons/TabButtons";
import TextContent from "./TextContent/TextContent";
import PreviewBar from "./PreviewBar/PreviewBar";
import classNames from "classnames";
// Util
import { getVideoDetails, getYouTubeSubtitles } from "../util/youTube";
import { getSummary } from "../util/openAI";


function Content() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [videoDetails, setVideoDetails] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [videoSummary, setVideoSummary] = useState('');

  const tabs = ['Summary'];

  useEffect(() => {
    let testSummary = "The video covers the Binstax Mamiya RB67 Fuji Instax adapter, which allows the user to take instant square format photos with their Mamiya RB67 camera. The adapter is a mechanical device that is fully mechanical and compact in size. There is no rotation like the rotating backs on Mamiya cameras, but it still has a dark slide holder, a viewfinder, and a winder. It is a great tool for making instant photos on set or when creating close-up shots, and it allows for the use of lower shutter speeds on the Mamiya RB67. The adapter can be loaded with Fujifilm Instax Square film, and it can be attached directly to the rotating back of the Mamiya RB67. There are some minor issues with the adapter, such as the placement of the crank, and the possibility of accidentally opening the film door when inserting the dark slide. Despite this, it is a fun addition to the Mamiya RB67 camera and produces great quality instant photos."
    testSummary = testSummary + "The video covers the Binstax Mamiya RB67 Fuji Instax adapter, which allows the user to take instant square format photos with their Mamiya RB67 camera. The adapter is a mechanical device that is fully mechanical and compact in size. There is no rotation like the rotating backs on Mamiya cameras, but it still has a dark slide holder, a viewfinder, and a winder. It is a great tool for making instant photos on set or when creating close-up shots, and it allows for the use of lower shutter speeds on the Mamiya RB67. The adapter can be loaded with Fujifilm Instax Square film, and it can be attached directly to the rotating back of the Mamiya RB67. There are some minor issues with the adapter, such as the placement of the crank, and the possibility of accidentally opening the film door when inserting the dark slide. Despite this, it is a fun addition to the Mamiya RB67 camera and produces great quality instant photos."

    setTimeout(() => {
      setVideoSummary(testSummary);
    }, 1000)});

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
  // useEffect(() => {
  //   async function fetchSummary() {
  //     const gptSummary = await getSummary(videoDetails, subtitles);
  //     console.log('summary', gptSummary);
  //     setVideoSummary(gptSummary);
  //   }    

  //   if (videoDetails && subtitles && !videoSummary) {
  //     console.log('fetching summary')
  //     fetchSummary();
  //   }
  // }, [videoDetails, subtitles]);

  // Reset state when videoId changes
  const resetState = () => {
    setActiveTab(0);
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

  useEffect(() => {
    // Send a message to the background script when the component has mounted
    chrome.runtime.sendMessage({ type: 'contentScriptMounted' });
  }, []);

  return (
    <div className={classNames('inkling-content', { visible: videoSummary?.length, expanded: isExpanded })}>
      <PreviewBar textContent={videoSummary} isExpanded={isExpanded} handleClick={handleBarClick} />

      <div className="mainContent">
        <TabButtons tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} />
        <TextContent currentTab={tabs[activeTab]} videoSummary={videoSummary} />
      </div>
    </div>
  );
}

export default Content;

// No english subtitles: https://www.youtube.com/watch?v=IKl2_5hBrjs

