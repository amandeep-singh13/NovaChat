/**importing express module */
const express = require('express');

/**creating router object */
const router = express.Router();

/**import all controllers*/
const controller = require('../controllers/userController.js');
const { protect, localVariables } = require("../middlewares/authMiddleware");


// Extracting functions from the imported controller object
const {
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
} = controller;

// Now you can use these functions as needed in your code


/**POST Methods */
router.route('/register').post(verifyRegister,sendOTP).get(protect,allUsers); //register user
router.route('/createUser').post(verifyOTP,registerController);
router.route('/regsiterMail').post(); //send the email
router.route('/authenticate').post(verifyLogin,sendOTP); //authenticate user
router.route('/verifyusername').post(verifyUser);
router.route('/login').post(verifyOTP, loginController); //login to app
router.route('/sendOTP').post(sendOTP); //send otp to mail

/**GET Methods */
router.route('/:username').get(getUser); //get user with username
router.route('/createResetSession').get(createResetSession); //reset all the variables

/**PUT Methods */
router.route('/updateUser').put(controller.updateUser); // is used to update the user profile
router.route('/resetPassword').put(controller.resetPassword); //used to reset password

module.exports = router;