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
const path = require("path")

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

// -------------------- DEPLOYMENT --------------------

var __dirname2 = path.resolve().split("/")
__dirname2.pop()
const __dirname1 = __dirname2.join("/")
console.log(__dirname1);
if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is Runnning Successfully!");
  })
}

// -------------------- DEPLOYMENT --------------------

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on ${PORT}!`))
