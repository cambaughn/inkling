import { getVideoId, getYoutubeData } from "./util";
console.log('background script ======');

// Listen for page change to get video information
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Wait for the page to complete loading so we only call this once
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.')) {
      chrome.tabs.sendMessage(tabId, { type: 'videoData', data: null });
      // do something here
      let videoId = getVideoId(tab.url);
      // get the video data
      getYoutubeData(videoId).then((videoData) => {
        // send the data to the content script
        chrome.tabs.sendMessage(tabId, { type: 'videoData', data: videoData });
      });
    }
  }
);