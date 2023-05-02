import { getVideoId } from "../content-script/util/youTube";
console.log('background script ======');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.')) {
    let videoId = getVideoId(tab.url);
    console.log('get video id =====', videoId);
    if (videoId) {
      chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });
    }
  }
});