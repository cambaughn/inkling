import React from 'react';
import './TabButtons.css';

const TabButtons = ({ tabs, activeTab, onChangeTab }) => {
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  return (
    <div className='buttonContainer'>
      {tabs.map((tab, index) => (
        <button
          className='inklingButton'
          style={{
            background: activeTab === index ? '#3F3F3F' : '#272727',
            color: 'white',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            marginRight: '20px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => onChangeTab(index)}
          key={tab}
        >
          { tab === 'Inkling' &&
            <img src={logoUrl} alt="Logo" className="logoSmall" />
          }
          <span>{tab}</span>
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
