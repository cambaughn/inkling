import { getVideoId, getYoutubeData } from "./util";
console.log('background script ======');

let pageLoaded = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.') && !pageLoaded) {
    pageLoaded = true;
    chrome.tabs.sendMessage(tabId, { type: 'videoData', data: null });
    chrome.tabs.sendMessage(tabId, { type: 'refreshDescription' });
    let videoId = getVideoId(tab.url);
    getYoutubeData(videoId).then((videoData) => {
      chrome.tabs.sendMessage(tabId, { type: 'videoData', data: videoData });
      pageLoaded = false;
    });
  }
});