import React, { useEffect, useState } from "react";
import './Description.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function Description({ currentTab, videoSummary, videoDescription }) {
  const [loadingText, setLoadingText] = useState('');
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  useEffect(() => {
    let text = getLoadingText();
    setLoadingText(text);
  }, []);

  return (
    <div className="descriptionContainer">
      {currentTab === 'Inkling' && videoSummary.length === 0 &&
        <div className="logoWrapper">
          <img src={logoUrl} alt="Logo" className="logo-spin" />
          <h3 className="loadingText">{loadingText}</h3>
        </div>
      }

      {currentTab === 'Inkling' && videoSummary.length > 0 &&
          <Linkify>
            {videoSummary}
          </Linkify>
        }


      { currentTab === 'Description' && videoDescription?.details?.length > 0 &&
        <div className="descriptionDetails">
          { videoDescription.details.map(detail => (
            <span>{detail}</span>
          ))}
        </div>
      }

      { currentTab === 'Description' && videoDescription &&
        <Linkify>
          {videoDescription.description}
        </Linkify>
      }
    </div>
  )
}

export default Description;
