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

const server = app.listen(PORT, () => console.log(`Server running on ${PORT}!`))

const roomStates = {};
const roomCurrentPlayers = {};
let roomid


function checkWinner(state) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }

  return null;
}

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
        roomid = room
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

    socket.on('joinGame', (roomid) => {
      if (!roomStates[roomid]) {
        roomStates[roomid] = Array(9).fill('');
      }
  
      if (!roomCurrentPlayers[roomid]) {
        roomCurrentPlayers[roomid] = 'X';
      }
  
      socket.emit('update', roomStates[roomid]);
      // To restrict a player not to play in other players turn
      socket.emit('currentPlayer', roomCurrentPlayers[roomid]);
    });
  
    socket.on('move', (data) => {
      //console.log(data);
      const { roomid, index } = data;
      const board = roomStates[roomid];
      const currentPlayer = roomCurrentPlayers[roomid];
  
      if (board[index] === '') {
        board[index] = currentPlayer;
  
        io.to(roomid).emit('update', board);
        roomCurrentPlayers[roomid] = currentPlayer === 'X' ? 'O' : 'X';
        io.to(roomid).emit('currentPlayer', roomCurrentPlayers[roomid]);
  
        const winner = checkWinner(board);
        if (winner) {
          io.to(roomid).emit('gameOver', winner);
          roomStates[roomid] = Array(9).fill('');
          roomCurrentPlayers[roomid] = 'X';
        }
      }
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    /*socket.on('join game', (room) => {
        socket.join(room)
        console.log(`User joined game with room: ${room}`);
    })

    socket.on('new move', (obj) => {
        console.log(obj);
        console.log(`joined game room ${obj.room}`);
        const res = {
            cell: obj.square, 
            turn: !obj.turn
        }
        socket.to(obj.room).emit('updated move', res)
    })*/
})

