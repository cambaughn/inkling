/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// import Logo from "./Logo";
import "./Content.css";
import { useEffect, useState } from "react";
import ButtonRow from "./ButtonRow/ButtonRow";
import Description from "./Description/Description";
// import Bar from "./Bar/Bar";
// import { findSubtitles } from "./util";

function Content({ videoId }) {
  // const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState('');

  const tabs = ['Inkling', 'Description'];

  const handleChangeTab = (tabIndex) => {
    console.log('handling change tab, ', tabIndex);
    setActiveTab(tabIndex);
  };

  const getVideoId = () => {
    const url = window.location.href;
    console.log(url);

    if (url) {
      const match = url.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11}).*/);
      if (match) {
        console.log('match!!!! ', match[1])
        return match[1];
        // setVideoId(match[1]);
      }
    }
  }
  // useEffect(getVideoId, []);

  const determineContent = () => {
    if (tabs[activeTab] === 'Inkling') {
      setContent(videoData?.gptResponse?.content);
    } else if (tabs[activeTab] === 'Description') {
      let videoDescription = videoData?.videoDetails?.snippet?.description;
      setContent(videoDescription);
    }
  }

  const getGist = async () => {
    try {
      console.log(`Sending text: ${text}`);
      let prompt = text;

      let updatedMessages = [...messages, {"role": "user", "content": prompt}];
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: updatedMessages
      })

      updatedMessages.push(response.data.choices[0].message);
      setMessages(updatedMessages);
      setText('');
      console.log('response! ', response.data.choices[0].message);
    } catch (error) {
      console.log('have error');
      console.error(error)
    }
  }

  // useEffect(() => {
  //   const updateUrl = () => {
  //     console.log('klsdjfldksjfldskjflkjdsf')
  //     getVideoId();

  //   }
  //   window.addEventListener("hashchange", updateUrl);

  //   return () => {
  //     window.removeEventListener("hashchange", updateUrl);
  //   };
  // }, []);



  useEffect(() => {
    const getYoutubeData = async () => {
      let currentVideo = videoId || getVideoId();

      console.log('got video id ', currentVideo);

      if (currentVideo) {
        const url = `https://regularimaginativedefinition.cameronbaughn.repl.co/video/${currentVideo}`;
        
        console.log('trying to get video data! ', currentVideo, url);

        const response = await fetch(url);
        const data = await response.json();
    
        console.log('data ==== ', data);
        setVideoData(data);
      }
    }

    // Run the first time no matter what
    getYoutubeData();

    // if (chrome?.tabs?.onUpdated) {
    //   console.log('tabs -----------')
    //   // Then, run on url change
    //   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    //     if (tab.active && changeInfo.status === 'complete') {
    //       getYoutubeData();
    //     }
    //   });
  
  
    //   // Cleanup function
    //   return () => {
    //     chrome.tabs.onUpdated.removeListener();
    //   };
    // }
  }, [])

  useEffect(determineContent, [videoData, activeTab]);

  return (
    <div className="App" id="inkling">
      <ButtonRow tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} />
      <Description content={content} />
    </div>
  );
}

export default Content;
