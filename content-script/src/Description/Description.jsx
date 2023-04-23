import React from "react";
import './Description.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function Description({ currentTab, inklingContent, videoDescription }) {
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  return (
    <div className="descriptionContainer">
      {!inklingContent && currentTab === 'Inkling' &&
        <div className="logoWrapper">
          <img src={logoUrl} alt="Logo" className="logo-spin" />
          <h3 className="loadingText">{getLoadingText()}</h3>
        </div>
      }



      { currentTab === 'Description' && videoDescription?.details?.length > 0 &&
        <div className="descriptionDetails">
          { videoDescription.details.map(detail => (
            <span>{detail}</span>
          ))}
        </div>
      }

      <Linkify>
        {currentTab === 'Inkling' &&
          <>
            {inklingContent}
          </>
        }

        { currentTab === 'Description' && videoDescription &&
          <>
            {videoDescription.description}
          </>
        }
      </Linkify>
    </div>
  )
}

export default Description;
