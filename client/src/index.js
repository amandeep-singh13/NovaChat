import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import ChatProvider from "./Context/ChatProvider";



ReactDOM.render(
     <React.StrictMode>
      <>
      <App />
      </>
      </React.StrictMode>
  ,document.getElementById('root')
);