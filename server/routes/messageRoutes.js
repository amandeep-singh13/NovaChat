const express = require('express');
const { protect } = require("../middlewares/authMiddleware");
const
 {
       sendMessage,
       allMessages,
       deleteMessage,
    //    addReaction,
    //    getMessageWithReactions
    likePost,
    dislikePost,
    heart,
    disheart
    }= require("../controllers/messageControllers");
const router = express.Router();
router.route('/messages').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);
router.route('/deleteMessage/:id').delete(protect, deleteMessage);
//router.route('/reaction').post(protect,addReaction);
//router.route('/messageWithReactions/:id').get(protect, getMessageWithReactions);
router.route('/like-post').put(protect,likePost);
router.route('/dislike-post').put(protect,dislikePost);
router.route('/heart-post').put(protect,heart);
router.route("/unheart-post").put(protect,disheart)



module.exports=router;