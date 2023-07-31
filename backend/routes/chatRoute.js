const express = require('express')
const { accessChat, fetchChats, createGroupChat, renameChat, addUser, removeUser } = require('../controllers/chatController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameChat)
router.route('/add').put(protect, addUser)
router.route('/remove').put(protect, removeUser)

module.exports = router