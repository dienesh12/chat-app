const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { all } = require('../routes/userRoute')


// @desc create a Chat or if chat exists access the Chat
// @route POST /api/chat
// @access Private
const accessChat = asyncHandler (async (req, res) => {
    const { userId } = req.body

    console.log(userId);
    console.log(req.user._id);

    if(!userId) {
        res.status(400).json({message: "UserId param not send with the request."})
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage")

    // Populate will fill the users property in chat model instead of showing just the user id. It will show all info of the user.

    // Populate the latestMessage in isChat with the User.
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email pic"
    })

    //console.log(isChat);

    if(isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).send(fullChat)
        } catch(err) {
            res.status(400).json({message: "Chat not created."})
        }
    }
})


// @desc get All chats of a user
// @route GET /api/chat
// @access Private
const fetchChats = asyncHandler ( async (req, res) => {
    try {
        var allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password")
                                .populate("latestMessage")
                                .sort({ updatedAt: -1 })
        allChats = await User.populate(allChats, {
            path: "latestMessage.sender",
            select: "name email pic"
        })
        res.status(200).send(allChats)
    } catch (err) {
        res.status(400).message({message: "Could not find Chats."})
    }
})


// @desc Create a Group Chat
// @route POST /api/chat/group
// @access Private
const createGroupChat = asyncHandler (async (req, res) => {
    if(!req.body.users && !req.body.name) {
        res.status(400).json({message: "Enter All Fields."})
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2) {
        res.status(400).json({message: "More than 2 users required to create a group chat."})
    }

    users.push(req.user)

    try {
        const createdGroup = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const fullGroup = await Chat.findOne({ _id: createdGroup._id })
                                    .populate("users", "-password")
                                    .populate("groupAdmin", "-password")

        res.status(200).send(fullGroup)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})


// @desc Update Group Chat Name
// @route PUT /api/chat/rename
// @access Private
const renameChat = asyncHandler (async (req, res) => {
    const { chatID, chatName } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatID, 
        {
            chatName
        },
        {
            new: true
        }
    ).populate("users", "-password")
     .populate("groupAdmin")

     if(!updatedChat) {
        res.status(404).json({message: "Chat not found."})
     } else {
        res.json(updatedChat)
     }
})


// @desc Add user to the group
// @route PUT /api/chat/add
// @access Private
const addUser = asyncHandler (async (req, res) => {
    const { chatId, userId } = req.body

    const addedChat = await Chat.findByIdAndUpdate(chatId, 
        {
           $push: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password")
     .populate("groupAdmin")

    if(!addedChat) {
        res.status(404).json({message: "Chat not found."})
    } else {
        res.json(addedChat)
    }
})


// @desc Remove user from the group
// @route PUT /api/chat/remove
// @access Private
const removeUser = asyncHandler (async (req, res) => {
    const { chatId, userId } = req.body

    const removedChat = await Chat.findByIdAndUpdate(chatId, 
        {
           $pull: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password")
     .populate("groupAdmin")

    if(!removedChat) {
        res.status(404).json({message: "Chat not found."})
    } else {
        res.json(removedChat)
    }
})


module.exports = { accessChat, fetchChats, createGroupChat, renameChat, addUser, removeUser }