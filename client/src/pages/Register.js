import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidate } from '../helper/validate';
import { registerUser } from '../helper/helper';
import convertToBase64 from '../helper/convert';
import axios from 'axios';
import styles from '../css/Username.module.css';


axios.defaults.baseURL = 'http://localhost:8080';
const Register = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: 'demo123@gmail.com',
      username: 'example123',
      password: 'admin@123'
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });
      console.log(typeof (file));
      console.log(values);
      try {
        const response = await axios.post('/api/user/register', values);
        if (response.data.success) {
          toast.success('OTP Sent Successfully', {
            duration: 4000,
            position: 'top-center',
          })
          navigate('/otp');
        } else {
          toast.error(response.data.message, { // Display error message from the server
            duration: 4000,
            position: 'top-center',
          });
        }

      } catch (error) {
        console.error('Registration error:', error);
        toast.error( error.response.data.message, { // Display generic error message for network or other issues
          duration: 4000,
          position: 'top-center',
        });
      }
      // let registerPromise = registerUser(values);
      // toast.promise(registerPromise, {
      //   loading: 'Creating...',
      //   success : <b>Register Successfully...!</b>,
      //   error : <b>Could not Register.</b>
      // });

      // registerPromise.then(function(){ navigate('/')});
    }
  })

  /**formik doesn't support file upload so we need to create thus handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
    console.log('File base64:', base64);
    console.log('Updated values:', { ...formik.values, profile: base64 });

  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "45%", paddingTop: "10em" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Happy to join you!</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} alt="avatar" className={styles.profile_img} />
              </label>

              <input onChange={onUpload} type="file" id="profile" name="profile"></input>
            </div>


            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="email" placeholder="Email*" />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username*" />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder="Password*" />
              <button className={styles.btn} type="submit">Register</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">Already a Member? <Link className="text-red-500" to="/login">Login Now</Link></span>
            </div>


          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

