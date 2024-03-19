const express = require('express');
const { protect } = require("../middlewares/authMiddleware");
const
 {
       sendMessage,
       allMessages
    }= require("../controllers/messageControllers");
const router = express.Router();
router.route('/messages').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);

module.exports=router;



// i have to include authmiddle ware here  then after this i will check the apis