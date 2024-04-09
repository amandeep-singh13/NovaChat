import React, {useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { useAuth } from '../Context/AuthContext';

import styles from '../css/Username.module.css';

axios.defaults.baseURL = 'http://localhost:8080';

const Login = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);
  const {isLoggedIn} = useAuth();

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        setUsername(values.username);
        console.log(values.username);
        const username = values.username;
        console.log(username);
        await axios.post('/api/user/verifyusername', { username });
        navigate('/password');
      } catch (error) {
        console.log(error);
        toast.error('Username Not Found', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  });

    //prevent for login user 
    useEffect(() => {
      if (isLoggedIn) {
        navigate("/chats");
      }
    }, [navigate,isLoggedIn]);
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Login</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Use existing account to login</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>


            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
              <button className={styles.btn} type="submit">Let's Go</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Not a Member <Link className="text-red-500" to="/register">Register Now</Link></span>
            </div>


          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
