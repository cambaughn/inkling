const fetchSubtitles = async (videoId) => {
  try {
    console.log('fetching subtitles for video:', videoId);
    const response = await fetch(`https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`);
    
    if (!response.ok) {
      console.error('Failed to fetch subtitles:', response.status, response.statusText);
      throw new Error(`Failed to fetch subtitles: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log('xmlText:', xmlText);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const texts = xmlDoc.getElementsByTagName("text");

    console.log('texts:', texts);
    let fullSubtitleText = Array.from(texts).map(node => node.textContent.trim()).join(' ');
    console.log('fullSubtitleText:', fullSubtitleText);
    
    return fullSubtitleText;
  } catch (error) {
    console.error('Error in fetchSubtitles:', error);
    throw error;
  }
};

export { fetchSubtitles };
