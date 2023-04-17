import React from "react";
import './Description.css';

function Description({ content }) {
  return (
    <div className="descriptionContainer">
      <p>{content}</p>
    </div>
  )
}

export default Description;
