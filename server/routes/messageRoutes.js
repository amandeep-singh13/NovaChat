const express = require('express');
const { protect } = require("../middlewares/authMiddleware");
const
 {
       sendMessage,
       allMessages,
       deleteMessage
    }= require("../controllers/messageControllers");
const router = express.Router();
router.route('/messages').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);
router.route('/deleteMessage/:id').delete(protect, deleteMessage);


module.exports=router;