import { getVideoId, getVideoDetails, getYouTubeSubtitles } from "../content-script/util/youTube";
import { getSummary } from "../content-script/util/openAI";


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    let videoId = getVideoId(tab.url);
    console.log('got video id =====', videoId);
    if (videoId) {
      // startObserver is a custom message type that tells the content script to start the MutationObserver
      chrome.tabs.sendMessage(tabId, { type: 'startObserver' });

      // Whenever the videoId changes, get the new video details
      let videoDetails = await getVideoDetails(videoId);
      let subtitles = await getYouTubeSubtitles(videoId);
      // When videoDetails and subtitles are available, send them to openAI for the summary
      let summary = await getSummary(videoDetails, subtitles);

      chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });
    }
  }
});

// --------







