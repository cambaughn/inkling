

const getVideoId = (url) => {
  if (url) {
    const match = url.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11}).*/);
    if (match) {
      return match[1];
      // setVideoId(match[1]);
    }
  } else {
    return null;
  }
}

// TODO: Decompose this into smaller functions that call different parts of the API for description, gpt info, etc.
// Requires change to server
const getYoutubeData = async (videoId) => {
  if (videoId) {
    const apiUrl = `https://regularimaginativedefinition.cameronbaughn.repl.co/video/${videoId}`;
    
    console.log('trying to get video data! ', videoId, apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('data ==== ', data);
    return data;
  }
}

export { getVideoId, getYoutubeData }