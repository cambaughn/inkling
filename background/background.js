import { getVideoId } from "../content-script/util/youTube";
import { XMLParser } from 'fast-xml-parser';

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
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'contentScriptMounted') {
    console.log('Content script mounted.');

    // Resend the video ID when the content script mounts
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { type: 'videoId', data: request.data });
    });
  } else if (request.type === 'fetchSubtitles') {
    const videoId = request.videoId;
    fetch(`https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`)
      .then(response => response.text())
      .then(xmlText => {
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlText);
        const texts = jsonObj.transcript.text;
        let fullSubtitleText = texts.map(node => node.trim()).join(' ');
        sendResponse({ subtitles: fullSubtitleText });
      })
      .catch(error => {
        console.error("Error fetching subtitles:", error);
        sendResponse({ error: 'Failed to fetch subtitles' });
      });
    return true; // Will respond asynchronously
  }
});
