const userModel = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const generateToken = require('../config/generateToken');
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
const registerController = asyncHandler(async (req, res) => {
    const { username, email, password, profile } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        console.log("no input recieved");
        throw new Error("Please enter all the feilds");
    }
    const usernameExists = await userModel.findOne({ username });
    const emailExists = await userModel.findOne({ email });
    if (usernameExists) {
        res.status(400);
        throw new Error("Username already exists");
    }
    if (emailExists) {
        res.status(400);
        throw new Error("Email already exists");
    }
    const user = await userModel.create({
        username,
        email,
        password,
        profile,
    });
    
    
    if (user) {
        // user.save()
        // .then(result => res.status(201).send({ msg: "User Register Successfully" }))
        // .catch(error => res.status(500).send({ error }))
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
        res.status(400);
        throw new Error("failed to create the user");
    }
});

/** middleware for verify user */
const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        // Check the user existence
        let exist = await userModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error: "Can't find User!" });
        }
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
});



//login api handling
const loginController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
        res.status(401);
        throw new Error("Username not found");
    }
    else if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            password: user.password,
            username: user.username,
            email: user.email,
            profile: user.profile,
            token: generateToken(user.password),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid password");
    }
});

//user search api/user/register?search=aradhya
const allUsers=asyncHandler(async(req,res)=>{
     const keyword = req.query.search 
     ? {
        $or: [
            { username: { $regex: req.query.search, $options: "i"} },
            { email: {$regex: req.query.search, $options: "i"} },
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
async function getUser(req, res) {

}


module.exports = {
    registerController,
    loginController,
    allUsers,
    getUser,
    verifyUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword
};