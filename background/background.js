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

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
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
      if (tabs[0]) {
        const activeTabId = tabs[0].id;
        const videoId = getVideoId(tabs[0].url);
        chrome.tabs.sendMessage(activeTabId, { type: 'videoId', data: videoId });
      }
    });
  }
});
