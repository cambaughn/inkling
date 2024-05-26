import { getSubtitles } from 'youtube-captions-scraper';

// Fetch the YouTube video ID from the URL
const getVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      return urlObj.searchParams.get("v");
    } else {
      console.warn('Not a YouTube URL:', url);
      return null;
    }
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
};

// Fetch subtitles using the youtube-captions-scraper package
const fetchSubtitles = async (videoId) => {
  try {
    console.log('Fetching subtitles for video:', videoId);
    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: 'en',
    });

    const fullSubtitleText = subtitles.map(subObject => {
      let subtitleText = subObject.text.trim();
      return subtitleText;
    }).join(' ');

    console.log('Full Subtitle Text:', fullSubtitleText);

    return fullSubtitleText;
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    throw error;
  }
};

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
