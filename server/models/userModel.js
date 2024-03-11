const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String ,
            required: [true, "Username is required"],
            unique: [true, "Username Exist"],
        },
        email: {
            type: String,
            required: [true, "Please provide a unique email"],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            unique: false,
        },
        firstName : {type: String},
        lastName : {type: String},
        address : {type: String},
        mobile : {type: Number},
        profile: {
            type: String,
            required: false,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            
        },
    },
    {
        timestamps: true
    }
);
const userModel = mongoose.model.users || mongoose.model("User",userSchema);

module.exports = userModel;