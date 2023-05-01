import { getSubtitles } from 'youtube-captions-scraper';


const getVideoId = (url) => {
  if (url) {
    const match = url.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11}).*/);
    if (match) {
      return match[1];
    }
  } else {
    return null;
  }
}


const getYouTubeSubtitles = async (videoId) => {
  const subtitles = await getSubtitles({
    videoID,
    lang: 'en',
  });

  console.log('2. Got subtitles ');

  const fullSubtitleText = subtitles
    .map((subObject) => subObject.text.trim())
    .join(' ');

  return fullSubtitleText;
}


const getYoutubeData = async (videoId) => {
  if (videoId) {
    const apiUrl = `http://localhost:3000/api/video/${videoId}`;
    
    console.log('trying to get video data! ', videoId, apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('data ==== ', data);
    return data;
  }
}

export { getYouTubeSubtitles, getVideoId, getYoutubeData }
