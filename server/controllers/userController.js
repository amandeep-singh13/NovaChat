const userModel = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const generateToken = require('../config/generateToken');

const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

/** POST: http://localhost:8080/api/user/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
// async function registerController(req, res) {
//     try {
//         const {username, password, profile, email} = req.body;
//         //check the existing user
//         const existUsername = new Promise((resolve,reject) => {
//             userModel.findOne({ username }, function(err,user){
//                 if(err) reject(new Error(err));
//                 if(user) reject({error : "Please use unique username"});

//                 resolve();
//             })
//         });

//         //check for existing email
//         const existEmail = new Promise((resolve,reject) => {
//             userModel.findOne({ email }, function(err,user){
//                 if(err) reject(new Error(err));
//                 if(user) reject({error : "Please use unique email"});

//                 resolve();
//             })
//         });

//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if(password){

//                 }
//             }).catch(error => {
//                 return res.status(500).send({
//                     error : "Enable to hashed password"
//                 })
//             })

//     } catch (error) {
//         return res.status(500).send(error);
//     }
// }

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
//register api handler
const verifyRegister = asyncHandler(async (req, res, next) => {
    const { username, email, password, profile } = req.body;
    console.log("register");
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }
    const usernameExists = await userModel.findOne({ username });
    const emailExists = await userModel.findOne({ email });
    if (usernameExists) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    req.app.locals = {username, email, password, profile, isVerified: true};
    next();
});

//actual Registration done here, database entry
const registerController = asyncHandler(async(req,res) =>{
    const { username, password, email, profile} = req.app.locals;
    //create user in database if otp is correct
    
    const user = await userModel.create({
        username,
        email,
        password,
        profile
    });


    if (user) {
        req.app.locals = {};
        res.status(201).json({
            _id: user._id,
            password: user.password,
            username: user.username,
            email: user.email,
            profile: user.profile,
            token: generateToken(user._id),
        })
    }
    else {
        res.status(400).json({ success: false, message: 'Failed to create user' });
    }
});


/** middleware for verify user */
const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const { username } = req.method === "GET" ? req.query : req.body;
        // Check the user existence
        let exist = await userModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error: "Username not found" });
        }
        if (req.method === "GET") {
            next();
        }
        else {
            res.status(201);
            res.json({
                usernameverified: true,
                username: exist.username
            });
        }
    } catch (error) {
        res.status(404);
        throw new Error("Authentication Error");
    }
});



//login api handling
const verifyLogin = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Username Not Found' });
    }
    else if (user && (await user.matchPassword(password))) {
        email = user.email;
        req.app.locals = {user, email, isVerified: true};
        next();
        
    }
    else {
        return res.status(401).json({ success: false, message: 'Invalid Password' });
    }
});

//loginUser in frontend after verifying 
const loginController = asyncHandler(async (req,res) => {
    if(req.app.locals.isVerified && req.app.locals.verifiedOTP){
        const user = req.app.locals.user;
        if(user){
            req.app.locals = {};
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile,
                token: generateToken(user._id),
            });
        }
    }
    return res.status(401).json({ success: false, message: 'Verification Not Done' });
});


//user search api/user/register?search=aradhya
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});







// /** GET: http://localhost:8080/api/user/example123 */
// async function getUser(req, res) {
//     res.json('getUser route');
// }

// /** PUT: http://localhost:8080/api/updateuser 
//  * @param: {
//   "header" : "<token>"
// }
// body: {
//     firstName: '',
//     address : '',
//     profile : ''
// }
// */
async function updateUser(req, res) {
    res.json('updateUser route');
}

/** POST: http://localhost:8080/api/user/sendOTP */
// Controller function to send OTP
const sendOTP =asyncHandler(async(req, res) => {
    const { email, isVerified } = req.app.locals;
    if(isVerified !== true){
        res.status(400).json({ success: false, message: 'Verify Details First' });
    }
    if(!email){
        res.status(400).json({ success: false, message: 'Email Address Not Known' });
    }
    const otp = generateOTP();

    if (!otp) {
        return res.status(500).json({ success: false, message: 'Failed to generate OTP' });
    }

    const emailSent = await sendEmail(email, otp);


    if (emailSent) {
        req.app.locals.otp = otp;
        res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
    } else {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});


/** POST: http://localhost:8080/api/user/verifyOTP */
const verifyOTP = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;
    console.log("enteredOTP", otp);
    const sentotp  =req.app.locals.otp;
    console.log("sentotp", sentotp);
    if(!sentotp){
        return res.status(400).json({ success: false, message: 'Request to Send OTP First!' });
    }
    if (otp !== sentotp) {
        return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }
    req.app.locals.verifiedOTP = true;
    next();
});

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have a valid session
/** PUT: http://localhost:8080/api/resetPassword */
async function resetPassword(req, res) {
    // Your implementation here
}
const getUser = asyncHandler(async (req, res) => {

});


module.exports = {
    verifyRegister,
    registerController,
    verifyLogin,
    loginController,
    allUsers,
    getUser,
    verifyUser,
    updateUser,
    sendOTP,
    verifyOTP,
    createResetSession,
    resetPassword
};