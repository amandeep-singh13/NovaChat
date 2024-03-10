// initializing or importing express and other modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const { chats } = require('./data/data');
const connectDb = require('./config/connectDb');
const router = require('./routes/userRoute');

//confid dot env file
dotenv.config();

// rest object
const app = express();

//middlewares
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

//port
const PORT = 8080 || process.env.PORT

//routes
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
})


/**api routes */
app.use('/api', router);

app.get('/api/chat', (req, res) => {
    res.send(chats);
})



/**connect db only when we have valid connection*/
connectDb().then(() => {
    try {
        //listen server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error =>{
    console.log("Invalid database connection...!");
})