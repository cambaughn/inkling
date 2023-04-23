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

  const tabs = ['Inkling', 'Description'];

  const handleChangeTab = (tabIndex) => {
    console.log('handling change tab, ', tabIndex);
    setActiveTab(tabIndex);
  };

  const getVideoId = () => {
    const url = window.location.href;
    console.log(url);

    if (url) {
      const match = url.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11}).*/);
      if (match) {
        console.log('match!!!! ', match[1])
        return match[1];
        // setVideoId(match[1]);
      }
    }
  }
  // useEffect(getVideoId, []);

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
        // do something with the video data
        setVideoData(message.data);
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
      <Description content={content} />
    </div>
  );
}

export default Content;
