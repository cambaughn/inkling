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

// Function to fetch data from a URL
const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

// Fetch subtitles directly using the YouTube API
const fetchSubtitles = async (videoId) => {
  try {
    console.log('Fetching subtitles for video:', videoId);
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoPageData = await fetchData(videoPageUrl);
    if (!videoPageData.includes('captionTracks')) {
      throw new Error(`Could not find captions for video: ${videoId}`);
    }

    const regex = /"captionTracks":(\[.*?\])/;
    const [match] = regex.exec(videoPageData);
    const { captionTracks } = JSON.parse(`{${match}}`);
    const subtitleTrack = captionTracks.find(track => track.vssId === '.en' || track.vssId === 'a.en' || track.vssId.match('.en'));

    if (!subtitleTrack || !subtitleTrack.baseUrl) {
      throw new Error(`Could not find English captions for ${videoId}`);
    }

    const transcriptUrl = subtitleTrack.baseUrl;
    const transcript = await fetchData(transcriptUrl);
    const lines = transcript
      .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
      .replace('</transcript>', '')
      .split('</text>')
      .filter(line => line && line.trim())
      .map(line => {
        const htmlText = line
          .replace(/<text.+>/, '')
          .replace(/&amp;/gi, '&')
          .replace(/<\/?[^>]+(>|$)/g, '');

        return htmlText.trim();
      }).join(' ');

    console.log('Full Subtitle Text:', lines);
    return lines;
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    throw error;
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

// Intercept web requests to add the appropriate CORS headers
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const responseHeaders = details.responseHeaders.filter(header => {
      return !['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers'].includes(header.name.toLowerCase());
    });

    responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: '*' });
    responseHeaders.push({ name: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' });
    responseHeaders.push({ name: 'Access-Control-Allow-Headers', value: '*' });

    return { responseHeaders };
  },
  { urls: ['*://www.youtube.com/*'] },
  ['blocking', 'responseHeaders', 'extraHeaders']
);
