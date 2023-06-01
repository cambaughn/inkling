import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import './TextContent.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function TextContent({ currentTab, videoSummary, commentsSummary, exploreDetails }) {
  const [loadingText, setLoadingText] = useState('');
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  useEffect(() => {
    let text = getLoadingText();
    setLoadingText(text);
  }, []);

  return (
    <div className="textContentContainer">
      <div 
      className="textContentInner"
      >
        {currentTab === 'Summary' && videoSummary.length === 0 &&
          <div className="logoWrapper">
            <img src={logoUrl} alt="Logo" className="logo-spin" />
            <h3 className="loadingText">{loadingText}</h3>
          </div>
        }

        {currentTab === 'Summary' && videoSummary.length > 0 &&
          <>
            {videoSummary.split('\n').map((line, index) => (
              <div key={`videoSummary-${index}`}>{line}</div>
            ))}
          </>
        }
        
        {currentTab === 'Comments' && commentsSummary.length > 0 &&
          <>
            {commentsSummary.split('\n').map((line, index) => (
              <div key={`comment-${index}`}>{line}</div>
            ))}
          </>
        }    

        {currentTab === 'Explore' && exploreDetails.length > 0 &&
          <Linkify>
            {exploreDetails.split('\n').map((line, index) => (
              <div key={`explore-${index}`}>{line}</div>
            ))}
          </Linkify>
        }
      </div>

    </div>
  )
}

export default TextContent;
