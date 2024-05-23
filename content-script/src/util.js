const { getSubtitles } = require('youtube-captions-scraper');


const findSubtitles = async (videoId) => {
  let subtitles = await getSubtitles({
    videoID: videoId, // youtube video id
    lang: 'en' // default: `en`
  })

  let fullSubtitleText = subtitles.map(subObject => {
    let subtitleText = subObject.text.trim();
    return subtitleText;
  }).join(' ');

  // console.log('subtitles !!! ', fullSubtitleText);
  return fullSubtitleText;
}


export { findSubtitles }