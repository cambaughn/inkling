import React from "react";
import './Description.css';
import Linkify from 'react-linkify';



function Description({ content }) {
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  // if (chrome?.runtime) {
  //   console.log('sdklfjdslkfjds ', chrome.runtime.getURL('logo.png'));
  // }

  console.log('logoUrl ', logoUrl);

  return (
    <div className="descriptionContainer">
      {!content &&
      <div className="logoWrapper">
      <img src={logoUrl} alt="Logo" className="logo-spin" />

      </div>
      }
      <Linkify>{content}</Linkify>
    </div>
  )
}

export default Description;
