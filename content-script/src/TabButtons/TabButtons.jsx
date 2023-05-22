import React from 'react';
import './TabButtons.css';
import classNames from 'classnames';

const TabButtons = ({ tabs, activeTab, onChangeTab, exploreDetails }) => {
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  return (
    <div className='buttonContainer'>
      {tabs.map((tab, index) => (
        <div
          className={classNames('inklingButton', { active: activeTab === index, invisible: tab === 'Explore' && exploreDetails?.length === 0 })}
          onClick={() => onChangeTab(index)}
          key={tab}
        >
          <span>{tab}</span>
        </div>
      ))}
    </div>
  );
};

export default TabButtons;
