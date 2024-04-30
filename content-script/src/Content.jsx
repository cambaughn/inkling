/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import TabButtons from "./TabButtons/TabButtons";
import TextContent from "./TextContent/TextContent";
import PreviewBar from "./PreviewBar/PreviewBar";
import Loading from "./Loading/Loading";
import classNames from "classnames";
// Util
import { getVideoDetails, getYouTubeSubtitles } from "../util/youTube";
import { getSummary, getCommentsSummary, getExploreDetails } from "../util/openAI";


function Content() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [videoDetails, setVideoDetails] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [videoSummary, setVideoSummary] = useState('');
  const [commentsSummary, setCommentsSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [exploreDetails, setExploreDetails] = useState('');
  const [error, setError] = useState(null);
  const [tabs, setTabs] = useState(['Summary']);

  const handleChangeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  }

  const handleBarClick = () => {
    toggleExpansion();
  };

  // Whenever the videoId changes, get the new video details
  useEffect(() => {
    console.log('have video id, getting video details ', videoId)
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
      setLoading(true);
      setError(null);
      const gptSummary = await getSummary(videoDetails, subtitles);

      if (gptSummary) {
        setVideoSummary(gptSummary);
      } else {
        setError('There was an error generating the summary. Please try again.');
      }
      setLoading(false);
    }

    console.log(videoDetails);

    let length = videoDetails?.contentDetails?.lengthInHours;

    if (videoDetails && subtitles && !videoSummary && length < 2) {
      console.log('fetching summary')
      fetchSummary();
    } else if (length >= 2) {
      console.log('video too long');
      setError('This video is too long to summarize. Please try a video that is less than 2 hours long.');
    }
  }, [videoDetails, subtitles]);


  // When the summary is available, send it to openAI for the explore details
  // useEffect(() => {
  //   async function fetchExploreDetails() {
  //     const exploreResponse = await getExploreDetails(videoSummary);

  //     if (exploreResponse) {
  //       setExploreDetails(exploreResponse);
  //     }
  //   }

  //   if (videoSummary && !exploreDetails) {
  //     console.log('fetching explore details');
  //     fetchExploreDetails();
  //   }
  // }, [videoSummary]);


  // Reset state when videoId changes
  const resetState = () => {
    setActiveTab(0);
    setVideoDetails(null);
    setSubtitles('');
    setIsExpanded(false);
    setVideoSummary('');
    setCommentsSummary('');
    setExploreDetails('');
  };

  // Listen for messages from background.js
  useEffect(() => {
    // Add message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'videoId' && message.data !== videoId) { // if there are changes to the videoId
        console.log('receiving video id in content script', message.data)
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
    <div className={classNames('inkling-content', { visible: videoSummary?.length && videoId, expanded: isExpanded })}>
      <Loading loading={loading} error={error} />
      <PreviewBar textContent={videoSummary} isExpanded={isExpanded} handleClick={handleBarClick} />

      <div className="mainContent">
        {/* <TabButtons tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} exploreDetails={exploreDetails} /> */}
        <TextContent currentTab={tabs[activeTab]} videoSummary={videoSummary} commentsSummary={commentsSummary} exploreDetails={exploreDetails} />
      </div>
    </div>
  );
}

export default Content;