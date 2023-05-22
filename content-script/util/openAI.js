import { Configuration, OpenAIApi } from 'openai';
import { sliceStringToRange } from './string';

const getSummary = async (videoDetails, subtitles) => {
  const OPENAI_API_KEY = chrome.runtime.getManifest().env.OPENAI_API_KEY;

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const splitTextIntoChunks = (text, chunkSize) => {
    if (text) {
      const regex = new RegExp(`^(.{1,${chunkSize}}[.!?,])\\s`);
      const matches = text.match(regex);
      if (matches) {
        const [chunk, remainingText] = matches.slice(1);
        const rest = splitTextIntoChunks(remainingText, chunkSize);
        return [chunk, ...rest];
      }
    }
    return [text];
  };
  

  const summarizeChunks = async (chunks) => {
    const summaries = [];
    for (const chunk of chunks) {
      const prompt = `Please provide a 2-3 sentence summary of the following text:\n\n${chunk}`;

      const messages = [
        {
          role: 'system',
          content:
            "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible.",
        },
        { role: 'user', content: prompt },
      ];

      console.log('Sending chunk to OpenAI:', chunk);
      const openAiResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });

      const responseText = openAiResponse?.data?.choices[0].message?.content;
      console.log('Received summary:', responseText);
      summaries.push(responseText);
    }
    return summaries;
  };

  try {
    const videoTitle = videoDetails?.snippet?.title;
    const videoDescription = videoDetails?.snippet?.description;

    const fullText = `${videoTitle} ${videoDescription} ${subtitles}`;

    const chunkSize = 2500;
    const chunks = splitTextIntoChunks(fullText, chunkSize).filter(chunk => !!chunk);

    console.log('Original text:', fullText);
    console.log('Split into chunks:', chunks);

    let summaries = await summarizeChunks(chunks);

    while (summaries.length > 1) {
      console.log('Summarizing chunks:', summaries);
      summaries = await summarizeChunks(summaries);
    }

    const finalSummary = summaries[0];
    console.log('Final summary:', finalSummary);

    return finalSummary;
  } catch (error) {
    console.log('error ', error)
    console.error(error);
    return null;
  }
};



const getExploreDetails = async (summary) => {
  const OPENAI_API_KEY = chrome.runtime.getManifest().env.OPENAI_API_KEY;

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const prompt = `Based on the video's content, provide some relevant links and resources for further exploration. Video summary: ${summary}`;

    const messages = [
      {
        role: 'system',
        content:
          "You're a research assistant designed to help users further research the content of YouTube videos by providing links to other websites and articles.",
      },
      { role: 'user', content: prompt },
    ];

    const openAiResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const responseText = openAiResponse?.data?.choices[0].message?.content;

    return responseText;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const getCommentsSummary = async (comments) => {
  const OPENAI_API_KEY = chrome.runtime.getManifest().env.OPENAI_API_KEY;

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const prompt = `Please provide a summary of the comments and their main points: \n\n- Comments: ${comments.join(
      ", "
    )}`;

    const messages = [
      {
        role: "system",
        content:
          "You're a research assistant designed to help users get the most important information out of comments. Analyze the comments and summarize their main points.",
      },
      { role: "user", content: prompt },
    ];

    const openAiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const responseText = openAiResponse?.data?.choices[0].message?.content;

    return responseText;
  } catch (error) {
    console.error(error);
    return null;
  }
};




export { getSummary, getCommentsSummary, getExploreDetails }