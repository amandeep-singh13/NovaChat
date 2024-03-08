import React from 'react'
import { Route } from "react-router-dom"
import ChatPage from './Pages/ChatPage'
import HomePage from './Pages/HomePage'

const App = () => {
  return (
    <div>
      <Route  exact path="/"  component={HomePage} />
      <Route  exact path="/chats" component={ChatPage} />

      
    </div>
  )
}

export default App
