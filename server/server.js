// initializing or importing express and other modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const { chats } = require("./data/data");

//confid dot env file
dotenv.config();

// rest object
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());



//routes
app.get('/', (req,res) => {
    res.send("API is running");
})

app.get('/api/chat', (req,res) => {
    res.send(chats);
})



//port
const PORT = 8081 || process.env.PORT

//listen server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})