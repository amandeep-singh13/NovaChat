const userModel = require('../models/userModel');

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
async function registerController(req, res) {
    try {
        const {username, password, profile, email} = req.body;
        //check the existing user
        const existUsername = new Promise((resolve,reject) => {
            userModel.findOne({ username }, function(err,user){
                if(err) reject(new Error(err));
                if(user) reject({error : "Please use unique username"});

                resolve();
            })
        });

        //check for existing email
        const existEmail = new Promise((resolve,reject) => {
            userModel.findOne({ email }, function(err,user){
                if(err) reject(new Error(err));
                if(user) reject({error : "Please use unique email"});

                resolve();
            })
        });

        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){

                }
            }).catch(error => {
                return res.status(500).send({
                    error : "Enable to hashed password"
                })
            })

    } catch (error) {
        return res.status(500).send(error);
    }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
async function loginController(req, res) {
    res.json('login route');
}

/** GET: http://localhost:8080/api/user/example123 */
async function getUser(req, res) {
    res.json('getUser route');
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
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
