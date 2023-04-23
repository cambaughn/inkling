import React from "react";
import './Description.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function Description({ currentTab, videoData }) {
  const [mainContent, setMainContent] = useState('');
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  return (
    <div className="descriptionContainer">
      {!videoData &&
        <div className="logoWrapper">
          <img src={logoUrl} alt="Logo" className="logo-spin" />
          <h3 className="loadingText">{getLoadingText()}</h3>
        </div>
      }
      {videoData &&
        <Linkify>
          { currentTab === 'Description' &&
            <>
              <span className="viewCount">{videoData?.videoDetails?.statistics?.viewCount}</span>
              <span className="datePublished">{videoData?.videoDetails?.snippet?.publishedAt}</span>
            </>
          }

        </Linkify>
      }
    </div>
  )
}

export default Description;
