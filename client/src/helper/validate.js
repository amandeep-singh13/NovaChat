import toast from 'react-hot-toast';
/**validate login page username */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);
    return errors;
}

/**validate given password */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);
    return errors;
}

/**validate register form */
export async function registerValidate(values){
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/** *************************** */

/**validate password */
function passwordVerify(error ={}, values){
    const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if(!values.password){
        error.password = toast.error("Password Required...!");
    }else if(values.password.includes(" ")){
        error.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        error.password = toast.error("Password must be more than  4 characters long");
    }else if(!specialChars.test(values.password)){
        error.password = toast.error("Password must have atleast one special character");
    }
    
    return error;
}


/**validate username */
function usernameVerify(error ={}, values){
    if(!values.username){
        error.username = toast.error("Username Required...!");
    }else if(values.username.includes(" ")){
        error.username = toast.error("Invalid Username...!");
    }
    return error;
}

/**validate email */
function emailVerify(error ={}, values){
    if(!values.email){
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Invalid email address...!");
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!");
    }
    return error;
}

/**validate OTP */
