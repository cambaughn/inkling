import React from 'react';
import classNames from 'classnames';
import './PreviewBar.css';

const PreviewBar = ({ textContent, isExpanded, handleClick }) => {
  return (
    <div className={'preview-bar'}>
      <div className={'previewButton'} onClick={handleClick}>
        {!isExpanded &&
          <img src={chrome.runtime.getURL('expand_up.svg')} className={'expandIcon'} />
        }

        { isExpanded &&
          <img src={chrome.runtime.getURL('expand_down.svg')} className={'expandIcon'} />
        }
      </div>
    </div>
  );
};

export default PreviewBar;


