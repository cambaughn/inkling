import React, { useState } from "react";
import cn from "classnames";
import "./Bar.css";

const Bar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn("bottom-bar", { "bottom-bar--expanded": isExpanded })}
      onClick={handleClick}
    >
      <div className="bottom-bar__content">
        <p>Some content goes here</p>
      </div>
    </div>
  );
};

export default Bar;
