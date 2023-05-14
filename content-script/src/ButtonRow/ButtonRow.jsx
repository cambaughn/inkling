import React from 'react';
import './ButtonRow.css';
import exp from 'constants';

const createButtonRow = () => {
  let tabs = ['Inkling', 'Description'];
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  let buttonContainer = document.createElement('div');
  buttonContainer.className = 'buttonContainer';

  tabs.forEach(function(tab, index) {
    let button = document.createElement('button');
    button.className = 'inklingButton';
    // button.style.background = activeTab === index ? '#3F3F3F' : '#272727';
    button.style.background = '#272727';
    button.style.color = 'white';
    button.style.borderRadius = '9999px';
    button.style.padding = '0.5rem 1rem';
    button.style.marginRight = '20px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    button.addEventListener('click', function() {
      // onChangeTab(index);
      console.log('clicked button ', tab);
    });

    let logoImg;
    if (tab === 'Inkling') {
      logoImg = document.createElement('img');
      logoImg.src = logoUrl;
      logoImg.alt = 'Logo';
      logoImg.className = 'logoSmall';
      button.appendChild(logoImg);
    }

    let span = document.createElement('span');
    span.innerText = tab;
    button.appendChild(span);

    buttonContainer.appendChild(button);
  });

  return buttonContainer;
}

export default createButtonRow;