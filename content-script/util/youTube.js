const { getSubtitles } = require('youtube-captions-scraper');

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

export { getYouTubeSubtitles }