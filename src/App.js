import React from 'react';
import FileUploadConversion from "./FileUploadConversion";
import logo from './mb-logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />       
        <FileUploadConversion />
      </header>
    </div>
  );
}

export default App;