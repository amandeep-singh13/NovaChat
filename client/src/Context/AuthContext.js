import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [otpState, setOtpState] = useState('');
  const [tokenTimeout, setTokenTimeout] = useState(null);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);


  const login = (token) => {
    // const decodedToken = jwtDecode(token);
    // const tokenExpirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    

    // const timeUntilExpiration = tokenExpirationTime - Date.now();
    // // Set a timeout to logout the user when the token expires
    // setTokenTimeout(setTimeout(logout, timeUntilExpiration));
    // console.log(tokenTimeout," and",tokenExpirationTime);
    setOtpState('');
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setOtpState('');
  };

  const setOtpFromRedirect = (redirectFrom) => {
    setOtpState(redirectFrom);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, otpState, setOtpFromRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};
