import { Configuration, OpenAIApi } from 'openai';
import { sliceStringToRange } from './string';

const getSummary = async (videoDetails, subtitles) => {
  const OPENAI_API_KEY = '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';

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const splitTextIntoChunks = (text, chunkSize) => {
    const chunks = [];
    let startIndex = 0;
  
    while (startIndex < text.length) {
      let endIndex = startIndex + chunkSize;
  
      // Adjust endIndex to end on punctuation if possible or a space if not
      if (endIndex < text.length) {
        while (endIndex > startIndex && !/[.!?,;: ]/.test(text.charAt(endIndex))) {
          endIndex--;
        }
      }
  
      // Slice the string and add it to the chunks array
      chunks.push(text.slice(startIndex, endIndex).trim());
  
      startIndex = endIndex;
    }
  
    return chunks;
  };
  
  const combineStrings = (strings, characterLimit) => {
    let combinedStrings = [];
    let currentString = '';
  
    for (let i = 0; i < strings.length; i++) {
      const string = strings[i];
  
      if (currentString.length + string.length <= characterLimit) {
        currentString += string;
      } else {
        combinedStrings.push(currentString);
        currentString = string;
      }
    }
  
    // Add the remaining string if any
    if (currentString.length > 0) {
      combinedStrings.push(currentString);
    }
  
    return combinedStrings;
  };
  
  

  const summarizeChunks = async (chunks) => {
    const summaries = [];
    for (const chunk of chunks) {
      // const prompt = `I am providing a transcription of a video. Please provide a 2-3 sentence summary of the main topic of the video, followed by bullet pointed list of the main points:\n\n${chunk}`;
      const prompt = `I am providing a transcription of a video. Please provide a concise bullet-pointed list of the main points of the video. Preserve opinions and sentiment:\n\n${chunk}`;

      const messages = [
        {
          role: 'system',
          content:
            "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible.",
        },
        { role: 'user', content: prompt },
      ];

      const openAiResponse = await openai.createChatCompletion({
        model: 'gpt-4o',
        messages,
      });

      const responseText = openAiResponse?.data?.choices[0].message?.content;
      summaries.push(responseText);
    }

    return summaries;
  };

  try {
    const videoTitle = videoDetails?.snippet?.title;
    // const videoDescription = videoDetails?.snippet?.description;

    const fullText = `${videoTitle}: ${subtitles}`;

    const chunkSize = 120000;
    const chunks = splitTextIntoChunks(fullText, chunkSize).filter(chunk => !!chunk);

    let summaries = await summarizeChunks(chunks);

    while (summaries.length > 1) {
      summaries = combineStrings(summaries, chunkSize);
      summaries = await summarizeChunks(summaries);
    }

    const finalSummary = summaries[0];
    
    return finalSummary;
  } catch (error) {
    console.error(error);
    return null;
  }
};



const getExploreDetails = async (summary) => {
  const OPENAI_API_KEY = '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';

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
  const OPENAI_API_KEY = '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';

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