const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const messageModel = mongoose.Schema({
    sender: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content: {type: String,trim:true},
    chat: {type: mongoose.Schema.Types.ObjectId,ref: "Chat"},
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [{type: mongoose.Schema.Types.ObjectId,ref: "Reaction"}],
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    heart:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    congrats:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
},
{
    timestamps: true,
});

const Message = mongoose.model("Message",messageModel);
module.exports = Message;