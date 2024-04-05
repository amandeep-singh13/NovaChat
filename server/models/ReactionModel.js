const mongoose = require('mongoose')
const reactionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactionType: { type: String, enum: ['like', 'dislike', 'heart'] }
}, { timestamps: true });

const Reactions = mongoose.model("Reaction", reactionSchema);
module.exports = Reactions;
