import { getVideoId } from "../content-script/util/youTube";
import { fetchSubtitles } from './util.js';

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const videoId = getVideoId(tab.url);
    console.log('Video ID:', videoId);

    // Send message to the content script with video ID or null
    chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });
  }
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.type === 'contentScriptMounted') {
    console.log('Content script mounted.');

    // Resend the video ID when the content script mounts
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { type: 'videoId', data: request.data });
    });
  } else if (request.type === 'fetchSubtitles') {
    const videoId = request.videoId;
    try {
      const subtitles = await fetchSubtitles(videoId);
      sendResponse({ subtitles });
    } catch (error) {
      sendResponse({ error: 'Failed to fetch subtitles' });
    }
    return true; // Will respond asynchronously
  }
});
