/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import Logo from "./Logo";
import "./App.css";
import Content from "../content-script/src/Content.jsx";

function App() {
  const active = 'content';

  if (import.meta.env.MODE === 'dev' && active === 'content') {
    return <Content />
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <Logo className="App-logo" id="App-logo" title="React logo" />
          <p>Hello, World!</p>
          <p>I'm a Chrome Extension Popup!</p>
        </header>
      </div>
    );
  }

}

export default App;
