import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

import styles from '../css/Username.module.css';

axios.defaults.baseURL = 'http://localhost:8080';
const OTPVerification = () => {

  const { isLoggedIn, login, otpState, setOtpFromRedirect } = useAuth();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //redirected from Register page
    if (otpState === 'isRegister') {
      try {
        const response = await axios.post('/api/user/createUser', { otp });
        if (response.status === 201) {
          toast.success('Register Successfully..', {
            duration: 4000,
            position: 'top-center',
          });
          setOtpFromRedirect('');
          navigate('/login'); // Redirect to success page
        } else {
          console.error('Failed to verify OTP:', response.data.message);
          // Display error message from the server
          toast.error(response.data.message || 'Failed to verify OTP', {
            duration: 4000,
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Failed to verify OTP:', error);
        // Display generic error message for network or other issues
        toast.error(error.response.data.message, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }

    //if redirected from login page
    else if (otpState === 'isLogin') {
      try {
        const response = await axios.post('/api/user/login', { otp });
        toast.success('Login Successfully', {
          duration: 4000,
          position: 'top-center',
        });
        console.log("the data is : ", response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        login();
        navigate('/chats');
      }
      catch (error) {
        console.error('Failed to verify OTP:', error);
        // Display generic error message for network or other issues
        toast.error(error.response.data.message, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }

  };
  const handleResendOTP = async () => {
    try {
      const response = await axios.post('/api/user/sendOTP');
      if (response.status === 200) {
        setOtp('');
        toast.success('OTP Resent Successfully', {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        console.error('Failed to resend OTP:', response.data.message);
        // Display error message from the server
        toast.error(response.data.message || 'Failed to resend OTP', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      // Display generic error message for network or other issues
      toast.error(error.response.data.message, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };
  useEffect(() => {
    if (isLoggedIn && (!otpState)) {
      navigate("/chats");
    }
    if (!otpState) {
      navigate("/");
    }
  }, [navigate]);


  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Verify It's You</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">To ensure secure sign in, verification is required</span>
          </div>

          <form className="pt-20" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">Enter 6 digit OTP sent to your email address.</span>
                <input className={styles.textbox} type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button className={styles.btn} type="submit">Done</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Can't get OTP? <button className="text-red-500" type="button" onClick={handleResendOTP}>Resend</button></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
