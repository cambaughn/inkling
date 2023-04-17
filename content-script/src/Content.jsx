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
        setVideoId(match[1]);
      }
    }
  }
  // useEffect(getVideoId, []);

  const determineContent = () => {
    console.log('determining content ');
    if (tabs[activeTab] === 'Inkling') {
      setContent('hello!')
    } else if (tabs[activeTab] === 'Description') {
      let videoDescription = videoData?.videoDetails?.snippet?.description;
      console.log('getting description ----------- ', videoDescription);
      setContent(videoDescription);
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
      if (videoId) {
        const url = `https://regularimaginativedefinition.cameronbaughn.repl.co/video/${videoId}`;
        
        console.log('trying to get video data! ', videoId, url);

        const response = await fetch(url);
        const data = await response.json();
    
        console.log('data ==== ', data);
        setVideoData(data);
      }
    }
    getYoutubeData();
  }, [])

  useEffect(determineContent, [videoData, activeTab]);


  console.log('active tab --------', activeTab)

  return (
    <div className="App" id="inkling">
      <ButtonRow tabs={tabs} activeTab={activeTab} onChangeTab={handleChangeTab} />
      <Description content={content} />
    </div>
  );
}

export default Content;
