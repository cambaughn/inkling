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
  const apiUrl = `http://localhost:3000/api/subtitles/${videoId}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();

  return data;
}


const getVideoDetails = async (videoId) => {
  const apiUrl = `http://localhost:3000/api/video/${videoId}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();

  return data;
}

export { getYouTubeSubtitles, getVideoId, getVideoDetails }
