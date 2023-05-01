const { Configuration, OpenAIApi } = require('openai');

const getSummary = async (videoDetails, subtitles) => {
  const OPENAI_API_KEY = chrome.runtime.getManifest().env.OPENAI_API_KEY;
  console.log('logging env variables: ', OPENAI_API_KEY);
  
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const videoTitle = videoDetails?.snippet?.title;
    const videoDescription = videoDetails?.snippet?.description;

    const prompt = `Please provide a 2-3 sentence summary of the main topic of the video, followed by bullet-pointed list of the main points. - Title: ${videoTitle}, - Description: ${videoDescription} - Transcript: ${subtitles}`;

    const messages = [
      {
        role: 'system',
        content:
          "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible. These videos can consist of a title, description, and transcript. Be aware that the description can contain product links, advertisements, sponsors, and other content that isn't directly relevant to the content of the video itself. Use it to educate yourself about the content of the video, but don't hold it in high regard, and don't return any sponsored or irrelevant content.",
      },
      { role: 'user', content: prompt },
    ];

    const openAiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });
    console.log( '3. Got GPT-3 response ');

    const responseText = openAiResponse?.data?.choices[0].message?.content;

    console.log('response ====> ', openAiResponse.data.choices[0].message.content);

    return responseText;
  } catch (error) {
    console.error(error);
    return null;
  }
};
