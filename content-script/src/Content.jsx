/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// import Logo from "./Logo";
import "./Content.css";
import { useEffect, useState } from "react";
import Bar from "./Bar/Bar";

function Content(videoId) {
  // const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState({});

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

  const getYoutubeData = async () => {
    if (videoId) {

    }
  }

  return (
    <div className="App" id="inkling">
      <Bar />
    </div>
  );
}

export default Content;
