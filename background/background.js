import { getVideoId, getYoutubeData } from "./util";
console.log('background script ======');

// Listen for page change to get video information
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Wait for the page to complete loading so we only call this once
    if (changeInfo.status === 'complete') {
      // do something here
      let videoId = getVideoId(tab.url);
      console.log('video id here: ', videoId);
      let videoData = getYoutubeData(videoId);
    }
  }
);