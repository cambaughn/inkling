import { Configuration, OpenAIApi } from 'openai';

const getSummary = async (videoDetails, subtitles) => {
  const OPENAI_API_KEY = chrome.runtime.getManifest().env.OPENAI_API_KEY;
  
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const videoTitle = videoDetails?.snippet?.title;
    const videoDescription = videoDetails?.snippet?.description;

    const firstMessage = 'The total length of the content I want to send you is too long to fit in only one piece. \n For sending you that content, I will follow this rule: \n [START PART 1/10] \n this is the content of part 1 of 10 total \n [END PART 1/10] \n Then you just answer "Received part 1/10" \n And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.'

    // Split the subtitles into an array of snippets no longer than 15k characters
    const MAX_LENGTH = 14000;
    subtitles = 'Transcript: ' + subtitles;
    let snippets = subtitles.match(new RegExp(`.{1,${MAX_LENGTH}}`, "g"));
    snippets.unshift(`Title: ${videoTitle}, - Description: ${videoDescription}`);

    snippets = snippets.map((snippet, index) => {
      return `[START PART ${index + 1}/${snippets.length}] \n ${snippet} \n [END PART ${index + 1}/${snippets.length}] \n Remember that you're not answering yet, just confirming that you received the part with the message "Received part ${index + 1}/${snippets.length}" and waiting for me to send you the next part.`;
    })

    const lastMessage = `ALL PARTS SENT. \n Please provide a 2-3 sentence summary of the main topic of the video, followed by bullet-pointed list of the main points.`;

    const messages = [
      {
        role: 'system',
        content:
          "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible. These videos can consist of a title, description, and transcript. Be aware that the description can contain product links, advertisements, sponsors, and other content that isn't directly relevant to the content of the video itself. Use it to educate yourself about the content of the video, but don't hold it in high regard, and don't return any sponsored or irrelevant content.",
      },
      { role: 'user', content: firstMessage },
    ];

    const openAiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    const responseText = openAiResponse?.data?.choices[0].message?.content;

    return responseText;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getSummary }