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

    console.log("Let's begin summary creation");

    // Split the subtitles into an array of snippets no longer than 15k characters
    const MAX_LENGTH = 14000;
    subtitles = `Title: ${videoTitle} \n Transcript: ${subtitles}`;
    let snippets = subtitles.match(new RegExp(`.{1,${MAX_LENGTH}}`, "g"));

    console.log(`Splitting subtitles into ${snippets.length} snippets`);

    // Send each snippet to the OpenAI API and get summaries
    let summaries = [];
    for (let i = 0; i < snippets.length; i++) {
      let snippet = snippets[i];
      let messages = [
        {
          role: 'system',
          content:
            "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible. These videos can consist of a title, description, and transcript.",
        },
        { role: 'user', content: `Please provide a short summary of this section of the video transcript. \n` + snippet },
      ];

      console.log(`Sending snippet ${i+1} to OpenAI API`);

      const openAiResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
      });

      const responseText = openAiResponse?.data?.choices[0].message?.content;
      summaries.push(responseText);
    }

    console.log(`Received ${summaries.length} summaries`);

    // Combine all summaries into a smaller summary of the entire thing
    let fullSummary = '';
    for (let i = 0; i < summaries.length; i++) {
      fullSummary += `${i+1}. ${summaries[i]}\n`;
    }

    console.log(`Combined all summaries into full summary`);

    // Send the full summary to the OpenAI API to get a shorter summary
    let messages = [
      {
        role: 'system',
        content:
          "You're a research assistant designed to help users get the most important content out of videos in the shortest time possible. These videos can consist of a title, description, and transcript.",
      },
      { role: 'user', content: `Please provide a shorter summary of the entire video, followed by a bullet-pointed list of the main points: \n` + fullSummary },
    ];

    console.log(`Sending full summary to OpenAI API`);

    const openAiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    const responseText = openAiResponse?.data?.choices[0].message?.content;

    console.log(`Received final summary`);

    return responseText;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return null;
  }
};

export { getSummary };
