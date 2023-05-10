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

const mode = chrome?.runtime?.getManifest().env?.MODE;
const baseApiUrl = mode === 'dev' ? 'http://localhost:3000/api' : 'https://inkling-api.vercel.app/api';
console.log('base api url =====', mode, baseApiUrl);
// https://inkling-api.vercel.app/api/subtitles/8tpv6n1ykfA

const getYouTubeSubtitles = async (videoId) => {
  const apiUrl = `${baseApiUrl}/subtitles/${videoId}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();

  return data;
}


const getVideoDetails = async (videoId) => {
  const apiUrl = `${baseApiUrl}/video/${videoId}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();

  return data;
}

export { getYouTubeSubtitles, getVideoId, getVideoDetails }
