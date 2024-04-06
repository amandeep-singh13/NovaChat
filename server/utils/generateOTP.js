const otpGenerator = require('otp-generator');

//function to generateOtp
function generateOTP(){
    try {
        const generatedOTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        return generatedOTP;
      } catch (error) {
        console.error("Error generating OTP:", error);
        return null;
      }
}

module.exports = generateOTP;