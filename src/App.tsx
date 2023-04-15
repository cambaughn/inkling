/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import Logo from "./Logo";
import "./App.css";
import Content from "../content-script/src/Content";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" id="App-logo" title="React logo" />
        <p>Hello, World!</p>
        <p>I'm a Chrome Extension Popup!</p>
      </header>

      <Content />
    </div>
  );
}

export default App;
