# Inkling - YouTube Summary Chrome Extension

Inkling is an open-source YouTube summary Chrome extension powered by the OpenAI API.


## Setup

### Clone repository
```sh
git clone git@github.com:cambaughn/inkling.git
```

### Install dependencies

```sh
yarn
```

### Build extension

```
yarn build
```

### Load extension

1. Navigate to [chrome://extensions/](chrome://extensions/)
1. Turn on the "Developer mode" toggle switch in the top right of the window
1. Click the "Load unpacked" button in top left of the window
1. Go to the `inkling` directory and select the `dist` directory to load the extension
1. Navigate to YouTube to see the Content Script React app in action
1. Go to extensions and click "Inkling" to see the Popup React app

## [Popup](https://developer.chrome.com/docs/extensions/mv3/user_interface/#popup)

The popup source code is in the `popup` directory.

## [Content Script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

The content script source code is in the `content-script` directory.
