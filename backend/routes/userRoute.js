const express = require('express')
const { registerUser, loginUser, allUsers, checkActive, logoutUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(registerUser).get(protect, allUsers)
router.route('/login').post(loginUser)
router.route('/isActive/:userId').get(checkActive)
router.route('/logout/:userId').put(logoutUser)

module.exports = router