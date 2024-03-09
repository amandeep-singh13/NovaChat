// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import ChatPage from './pages/Chatpage';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Routes> 
      <Route exact path="/" element={<HomePage />} /> 
      <Route exact path="/chats" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
