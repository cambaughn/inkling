import React from "react";
import './Description.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function Description({ content }) {
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  return (
    <div className="descriptionContainer">
      {!content &&
        <div className="logoWrapper">
          <img src={logoUrl} alt="Logo" className="logo-spin" />
          <h3 className="loadingText">{getLoadingText()}</h3>
        </div>
      }
      <Linkify>{content}</Linkify>
    </div>
  )
}

export default Description;
