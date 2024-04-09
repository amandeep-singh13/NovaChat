const express = require('express');
const { protect } = require("../middlewares/authMiddleware");
const
 {
       sendMessage,
       allMessages,
       deleteMessage,
       addReaction,
       getMessageWithReactions
    }= require("../controllers/messageControllers");
const router = express.Router();
router.route('/messages').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);
router.route('/deleteMessage/:id').delete(protect, deleteMessage);
router.route('/reaction').post(protect,addReaction);
router.route('/messageWithReactions/:id').get(protect, getMessageWithReactions);

module.exports=router;