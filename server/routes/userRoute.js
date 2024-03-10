/**importing express module */
const express = require('express');

/**creating router object */
const router = express.Router();

/**import all controllers*/
const controller = require('../controllers/userController.js');

// Extracting functions from the imported controller object
const {
  registerController,
  loginController,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword
} = controller;

// Now you can use these functions as needed in your code


/**POST Methods */
router.route('/register').post(controller.registerController); //register user
router.route('/regsiterMail').post(); //send the email
router.route('/authenticate').post((req,res) => res.end()); //authenticate user
router.route('/login').post(controller.loginController); //login to app

/**GET Methods */
router.route('/user/:username').get(controller.getUser); //get user with username
router.route('/generateOTP').get(controller.generateOTP); //genrate random OTP
router.route('/vertifyOTP').get(controller.verifyOTP); //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); //reset all the variables

/**PUT Methods */
router.route('/updateUser').put(controller.updateUser); // is used to update the user profile
router.route('/resetPassword').put(controller.resetPassword); //used to reset password

module.exports = router;