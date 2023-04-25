import { getVideoId, getYoutubeData } from "./util";
console.log('background script ======');

let currentVideoId = null;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.')) {
    chrome.tabs.sendMessage(tabId, { type: 'videoData', data: null });
    chrome.tabs.sendMessage(tabId, { type: 'refreshDescription' });
    let videoId = getVideoId(tab.url);
    currentVideoId = videoId;
    getYoutubeData(videoId).then((videoData) => {
      if (videoId === currentVideoId) {
        console.log('video id! ', videoId, currentVideoId)
        chrome.tabs.sendMessage(tabId, { type: 'videoData', data: videoData });
      }
    });
  }
});