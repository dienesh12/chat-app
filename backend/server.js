const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./config/db')
require('dotenv').config()
const PORT = process.env.PORT || 4000
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute = require('./routes/messageRoute')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => console.log(`Server running on ${PORT}!`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id);
        socket.emit("Connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("User joined room: " + room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id === newMessageRecieved.sender._id) return 

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })
})

