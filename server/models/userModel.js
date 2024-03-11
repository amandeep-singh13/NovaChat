const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
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
userSchema.methods.matchPassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
}
userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
const userModel = mongoose.model.users || mongoose.model("User",userSchema);

module.exports = userModel;