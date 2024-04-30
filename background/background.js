import { getVideoId } from "../content-script/util/youTube";

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    const videoId = getVideoId(tab.url);
    console.log('Video ID:', videoId);

    // Send message to the content script with video ID or null
    chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'contentScriptMounted') {
    console.log('Content script mounted.');

    // Resend the video ID when the content script mounts
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { type: 'videoId', data: request.data });
    });
  }
});
