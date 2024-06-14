document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');

  // Load the saved API key from local storage and display it
  chrome.storage.local.get('openaiApiKey', (data) => {
    if (data.openaiApiKey) {
      apiKeyInput.value = data.openaiApiKey;
    }
  });

  // Save the API key to local storage
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        statusMessage.textContent = 'API key saved!';
        statusMessage.style.color = 'green';
        setTimeout(() => {
          statusMessage.textContent = '';
        }, 2000);
      });
    } else {
      statusMessage.textContent = 'Please enter a valid API key.';
      statusMessage.style.color = 'red';
    }
  });
});
