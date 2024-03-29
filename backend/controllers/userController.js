const User = require('../models/userModel')
const generateToken = require('../config/generateToken')
const asyncHandler = require('express-async-handler')


// @desc Register User
// @route POST /api/user
// @access Private
const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password, pic } = req.body

    console.log(name);

    if(!name || !email || !password) {
        res.status(409).json({message: "All fields required."})
    }

    const duplicate = await User.findOne({ email })

    if(duplicate) {
        res.status(400).json({message: "User Already Exists."})
    }

    const newUser = await User.create({
        name,
        password,
        email,
        pic,
        isActive: true
    })

    if(newUser) {
        res.status(200).json({
            _id: newUser._id,
            password: newUser.password,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id),
            isActive: true
        })
    } else {
        res.status(400).json({message: "Failed to create a user."})
    }
})


// @desc Login User
// @route POST /api/user/login
// @access Private
const loginUser = asyncHandler ( async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    await User.updateOne({ email }, {
        $set: {
            isActive: true
        },
    })

    if(user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            password: user.password,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            isActive: true
        })
    } else {
        res.status(400).json({message: "User not found."})
    }
})

// @desc Get All users (or) Search Function
// @route GET /api/user?search=dinesh
// @access Private
const allUsers = asyncHandler ( async (req, res) => {
    const keyword = req.query.search
        ?   {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } }
                ]
            }
        :   {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.json(users)
})

// @desc Check if user is active
// @route GET /api/user/isActive/:userId
// @access Public
const checkActive = asyncHandler (async (req, res) => {
    const userId = req.params.userId

    if(!userId) {
        return res.status(400).json({ message: "Please send the userId" })
    }

    const user = await User.findOne({ _id: userId })

    if(!user) {
        return res.status(400).json({ message: "User Not Found, Enter correct userId" })
    }

    res.status(200).json({ 
        name: user.name,
        isActive: user.isActive,
    })
})

// @desc Logout User
// @route GET /api/user/logout/:userId
// @access Public
const logoutUser = asyncHandler( async (req, res) => {
    const userId = req.params.userId

    if(!userId) {
        return res.status(400).json({ message: "Please provide the userID" })
    }

    const user = await User.updateOne({ _id: userId }, {
        $set: {
            isActive: false
        }
    })

    if(!user) {
        return res.status(400).json({ message: "User Not found" })
    }

    res.status(200).json({ message: "User logged out Successfully!" })
})

module.exports = { registerUser, loginUser, allUsers, checkActive, logoutUser }