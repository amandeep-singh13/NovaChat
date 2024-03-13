// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import ChatPage from './pages/Chatpage';
import HomePage from './pages/HomePage';

/**import all components */
import Login from './pages/Login';
import Password from './pages/Password';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
// import ChatProvider from './Context/ChatProvider';
import {AuthorizeUser,ProtectRoute} from "./middlewares/auth"
/** root routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <HomePage/>
  },
  {
    path : '/register',
    element : <Register/>
  },
  {
    path : '/chats',
    element : /*<AuthorizeUser>*/
    <ChatPage/>
   /* </AuthorizeUser>*/
  },
  {
    path : '/login',
    element : <Login/>
  },
  {
    path : '/password',
    element : <Password/>
  },
  {
    path : '/profile',
    element : <Profile/>
  },
  {
    path : '/recovery',
    element : <Recovery/>
  },
  {
    path : '/reset',
    element : <Reset/>
  },
  {
    path : '/otp',
    element : <OTPVerification/>
  },
  {
    path : '*',
    element : <PageNotFound/>
  },
])

const App = () => {
  return (
    <main> 
      <RouterProvider router = {router}>
      </RouterProvider>
    </main>
  );
}

export default App;