import { getVideoId } from "../content-script/util/youTube";
console.log('background script ======');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.')) {
    chrome.tabs.sendMessage(tabId, { type: 'videoData', data: null });
    chrome.tabs.sendMessage(tabId, { type: 'refreshDescription' });
    let videoId = getVideoId(tab.url);
    console.log('get video id =====', videoId);
    chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });

    // getYoutubeData(videoId).then((videoData) => {
    //   if (videoId === currentVideoId) {
    //     chrome.tabs.sendMessage(tabId, { type: 'videoData', data: videoData });
    //   }
    // });
  }
});