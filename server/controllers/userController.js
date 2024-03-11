const userModel = require('../models/userModel');
const asyncHandler=require("express-async-handler");
const generateToken=require('../config/generateToken');
/** POST: http://localhost:8080/api/register 
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
const registerController=asyncHandler(async(req,res)=>{
    const {username,email,password,profile}=req.body;
    if(!username|| !email || !password || !profile){
        res.status(400);
        throw new Error("Please enter all the feilds");
    }
    const userExists=await userModel.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user=await userModel.create({
        username,
        email,
        password,
        profile,
    });
    if(user){
        res.status(201).json({
            password:user.password,
            username:user.username,
            email:user.email,
            profile:user.profile,
            token:generateToken(user.password),
        })
    }
    else{
        res.status(400);
        throw new Error("failed to create the user");
    }
});

const loginController=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            password:user.password,
            username:user.username,
            email:user.email,
            profile:user.profile,
            token:generateToken(user.password),
        });
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
})




// async function loginController(req, res) {
//     res.json('login route');
// }

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

/** GET: http://localhost:8080/api/generateOTP */
async function generateOTP(req, res) {
    res.json('generateOTP route');
}

/** GET: http://localhost:8080/api/verifyOTP */
async function verifyOTP(req, res) {
    res.json('verifyOTP route');
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
async function createResetSession(req, res) {
    // Your implementation here
}

// update the password when we have a valid session
/** PUT: http://localhost:8080/api/resetPassword */
async function resetPassword(req, res) {
    // Your implementation here
}
async function getUser(req,res){

}


module.exports = {
    registerController,
    loginController,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword
};