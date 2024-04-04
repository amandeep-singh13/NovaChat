const express = require('express');
const { protect } = require("../middlewares/authMiddleware");
const
 {
       sendMessage,
       allMessages,
       deleteMessage,
       addReaction,
    }= require("../controllers/messageControllers");
const router = express.Router();
router.route('/messages').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);
router.route('/deleteMessage/:id').delete(protect, deleteMessage);
router.route('/addReaction').post(protect, addReaction);

module.exports=router;