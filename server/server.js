// initializing or importing express and other modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const { chats } = require('./data/data');
const connectDb = require('./config/connectDb');
const messageRoutes = require("./routes/messageRoutes");
const router = require('./routes/userRoute');

const {notFound,errorHandler}=require("./middlewares/errorMiddleware");
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
app.use('/api/user',router);

app.get('/api/chat', (req, res) => {
    res.send(chats);
})

app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

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
