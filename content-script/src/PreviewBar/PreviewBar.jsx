import React from 'react';
import classNames from 'classnames';
import './PreviewBar.css';

const PreviewBar = ({ textContent, isExpanded }) => {
  return (
    <div className={'preview-bar'}>
      {!isExpanded &&
        <div className={'previewContent'}>
          <img src={chrome.runtime.getURL('expand_up.svg')} />
          {textContent && (
            <span className="previewText">{textContent}</span>
          )}
          <img src={chrome.runtime.getURL('expand_up.svg')} />
        </div>
      }

      { isExpanded &&
        <div className={'expandedContent'}>
          <img src={chrome.runtime.getURL('expand_down.svg')} className={'expandDownIcon'} />
        </div>
      }
    </div>
  );
};

export default PreviewBar;


