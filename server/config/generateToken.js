const jwt=require('jsonwebtoken')


const generateToken=(password)=>{
    return jwt.sign({password},process.env.JWT_SECRET,{
        expiresIn:"30d",
    });
};
module.exports=generateToken;