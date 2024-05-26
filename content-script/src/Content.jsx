/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import TextContent from "./TextContent/TextContent";

function Content() {
  const [videoId, setVideoId] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [error, setError] = useState(null);

  const fetchSubtitles = async () => {
    if (videoId) {
      try {
        console.log('Trying to get subtitles');
        const response = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ type: 'fetchSubtitles', videoId: videoId }, (response) => {
            if (response.error) {
              reject(response.error);
            } else {
              resolve(response.subtitles);
            }
          });
        });
        console.log('Transcript:', response);
        setSubtitles(response);
      } catch (error) {
        console.error('Error fetching subtitles:', error);
        setError('Failed to fetch subtitles');
      }
    }
  };

  // Listen for messages from background.js
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'videoId' && message.data !== videoId) {
        console.log('Receiving video id in content script', message.data);
        setVideoId(message.data);
        console.log('Setting video id', message.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up by removing message listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [videoId]);

  useEffect(() => {
    // Send a message to the background script when the component has mounted
    chrome.runtime.sendMessage({ type: 'contentScriptMounted' });
  }, []);

  return (
    <div className={'inkling-content'}>
      <div className="mainContent">
        <button onClick={fetchSubtitles}>Fetch Subtitles</button>
        {error && <p className="error">{error}</p>}
        <TextContent subtitles={subtitles} />
      </div>
    </div>
  );
}

export default Content;
