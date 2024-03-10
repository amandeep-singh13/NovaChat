// importing mongoose package
const mongoose = require('mongoose');
const colors = require('colors');
//function to create database connection
// making this async by using try catch block
const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Server Running On ${mongoose.connection.host}`.bgCyan.white);
        return db;
    } catch (error) {
        console.log(`${error}`.bgRed)
    }
};
module.exports = connectDb