import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { useAuth } from '../Context/AuthContext'

import styles from '../css/Username.module.css';

axios.defaults.baseURL = 'http://localhost:8080';
const Password = () => {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const { isLoggedIn, setOtpFromRedirect } = useAuth();


  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        if (username) {
          const password = values.password;
          console.log(password);
          const response = await axios.post('/api/user/authenticate', { username, password });
          if(response.data.success){
            toast.success('OTP Sent Successfully', {
              duration: 4000,
              position: 'top-center',
            });

          }
          else {
            toast.error(response.data.message, { // Display error message from the server
              duration: 4000,
              position: 'top-center',
            });
          }
          setOtpFromRedirect('isLogin');
          
          navigate('/otp');
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error( error.response.data.message, { // Display generic error message for network or other issues
          duration: 4000,
          position: 'top-center',
        });
      }

    }
  });

  //prevent for login user or whose username is not verified
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chats");
    }
    if(!username){
      navigate("/login");
    }  
  }, [navigate,isLoggedIn,username]);
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Login</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Please enter the correct password to login</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>


            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder="Password" />
              <button className={styles.btn} type="submit">Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Forgot Password? <Link className="text-red-500" to="/recovery">Recover Now</Link></span>
            </div>


          </form>
        </div>
      </div>
    </div>
  )
}

export default Password

