const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'novachat88@gmail.com',
        pass: 'tqmu crrp muxm fjeo'
    }
});

// Function to send email
async function sendEmail(email, otp) {
    const mailOptions = {
        from: 'NovaChat',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`
    };

    try {
        
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = sendEmail;
