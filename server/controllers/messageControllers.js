const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const userModel = require("../models/userModel");
const Chat = require("../models/chatModel");
const Reaction = require("../models/ReactionModel")

const sendMessage=asyncHandler(async (req, res)=>{
    const { content, chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage); 
   
        message = await message.populate("sender", "username profile");
        message = await message.populate("chat");
        message = await userModel.populate(message, {
            path:'chat.users',
            select: "username profile email",

        });
        await Chat.findByIdAndUpdate(req.body.chatId,{ 
            latestMessage: message,
        })

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages=asyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
            .populate("sender", "username profile email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
 const deleteMessage = asyncHandler(async (req, res) => {
    const messageId = req.params.id;
  
    try {
      // Find the message by ID and delete it from the database
      await Message.findByIdAndDelete(messageId);
      res.status(204).send(); 
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Internal server error' }); // Send a 500 Internal Server Error response if an error occurs
    }
});

// Add functions for handling reactions
const addReaction = asyncHandler(async (req, res) => {
    const { messageId, reactionType } = req.body;
    try{
    const reaction = await Reaction.create({ userId: req.user._id, messageId, reactionType });
    await Message.findByIdAndUpdate(messageId, { $push: { reactions: reaction._id } });
    res.json(reaction);
    } catch(error){
        res.status(500).json({ error: "Internal server error"});
    }
});

const getMessageWithReactions = asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const message = await Message.findById(messageId).populate('reactions');
    res.json(message);
});



module.exports={sendMessage, allMessages,deleteMessage,addReaction,getMessageWithReactions};
