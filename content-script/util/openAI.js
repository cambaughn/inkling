import { Configuration, OpenAIApi } from 'openai';

const getApiKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('openaiApiKey', (data) => {
      if (data.openaiApiKey) {
        resolve(data.openaiApiKey);
      } else {
        reject('OpenAI API key not found. Please enter your API key in the extension settings.');
      }
    });
  });
};

const getSummary = async (videoDetails, subtitles) => {
  try {
    const OPENAI_API_KEY = await getApiKey();
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
          model: 'gpt-4o-mini',
          // model: 'gpt-3.5-turbo',
          messages,
        });

        const responseText = openAiResponse?.data?.choices[0].message?.content;
        summaries.push(responseText);
      }

      return summaries;
    };

    const videoTitle = videoDetails?.snippet?.title;
    const fullText = `${videoTitle}: ${subtitles}`;

    const chunkSize = 14000;
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

export { getSummary };
