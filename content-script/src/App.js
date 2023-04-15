/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import Logo from "./Logo";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  console.log('content here!!!!')
  const [videoId, setVideoId] = useState<string>('');

  const currentUrl = window.location.href;
  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const url = urlParams.get('url');
    const url = window.location.href;


    console.log('trying to get the url ', url);
    

    if (url) {
      const match = url.match(/(?:\/|%3D|v=)([0-9A-Za-z_-]{11}).*/);
      if (match) {
        console.log('match!!!! ', match[1])
        setVideoId(match[1]);
      }
    }
  }, []);

  console.log(currentUrl);
  return (
    <div className="App" id="inkling">
      
    </div>
  );
}

export default App;
