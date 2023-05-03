const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')

// @desc Send new Message
// @route POST /api/message
// @access Private
const sendMessage = asyncHandler (async (req, res) => {
    const { content, chatId } = req.body
    
    if(!content || !chatId) {
        res.status(400).json({message: "Invalid data passed into request"})
    }

    try {
        let message = await Message.create({ sender: req.user._id, content, chat: chatId });

        message = await (
          await message.populate("sender", "name pic")
        ).populate({
          path: "chat",
          select: "chatName isGroupChat users groupAdmin",
          model: "Chat",
          populate: { path: "users", select: "name email pic", model: "User" },
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

// @desc Fetch All messages
// @route GET /api/message
// @access Private
const getAllMessages = asyncHandler(async (req, res) => {
    try {
        let messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name email pic")
                                                                        .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage, getAllMessages }