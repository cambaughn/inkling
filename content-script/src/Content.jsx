/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import "./Content.css";
import { useEffect, useState } from "react";
import TextContent from "./TextContent/TextContent";

// Function to extract subtitles directly from the YouTube page content
const extractSubtitles = async (videoId) => {
  try {
    console.log('Fetching subtitles for video:', videoId);

    // Get the page content
    const videoPageData = document.documentElement.innerHTML;
    if (!videoPageData.includes('captionTracks')) {
      throw new Error(`Could not find captions for video: ${videoId}`);
    }

    // Extract captionTracks using regex
    const regex = /"captionTracks":(\[.*?\])/;
    const [match] = regex.exec(videoPageData);
    const { captionTracks } = JSON.parse(`{${match}}`);
    const subtitleTrack = captionTracks.find(track => track.vssId === '.en' || track.vssId === 'a.en' || track.vssId.match('.en'));

    if (!subtitleTrack || !subtitleTrack.baseUrl) {
      throw new Error(`Could not find English captions for ${videoId}`);
    }

    // Fetch the subtitles
    const response = await fetch(subtitleTrack.baseUrl);
    const transcript = await response.text();
    const lines = transcript
      .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
      .replace('</transcript>', '')
      .split('</text>')
      .filter(line => line && line.trim())
      .map(line => {
        const htmlText = line
          .replace(/<text.+>/, '')
          .replace(/&amp;/gi, '&')
          .replace(/<\/?[^>]+(>|$)/g, '');

        return htmlText.trim();
      }).join(' ');

    console.log('Full Subtitle Text:', lines);
    return lines;
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    throw error;
  }
};

function Content() {
  const [videoId, setVideoId] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [error, setError] = useState(null);

  const fetchSubtitles = async () => {
    if (videoId) {
      try {
        console.log('Trying to get subtitles for video ID:', videoId);
        const transcript = await extractSubtitles(videoId);
        console.log('Transcript:', transcript);
        setSubtitles(transcript);
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
        console.log('Receiving video ID in content script:', message.data);
        setVideoId(message.data);
        console.log('Setting video ID:', message.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up by removing message listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      fetchSubtitles();
    }
  }, [videoId]);

  useEffect(() => {
    // Send a message to the background script when the component has mounted
    console.log('Content script mounted, sending message to background script');
    chrome.runtime.sendMessage({ type: 'contentScriptMounted' });
  }, []);

  return (
    <div className={'inkling-content'}>
      <div className="mainContent">
        {error && <p className="error">{error}</p>}
        <TextContent subtitles={subtitles} />
      </div>
    </div>
  );
}

export default Content;
