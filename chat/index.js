const express = require("express")
const path = require("path")
const { Server } = require("socket.io")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 9000

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({message: "ok"})
})

const httpServer = app.listen(PORT, () => {
    console.log(`Chat Server is up and running on PORT ${PORT}!`)
})

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

const chatSocket = io.of('/chat')
const gameSocket = io.of('/game')

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

// ---------------------------- Chat Socket ------------------------

chatSocket.on("connection", (socket) => {
    //console.log("Connected to Socket.io")
  socket.on('setup', (userData) => {
      socket.join(userData._id)
      //console.log(userData._id);
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

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
})

// ---------------------------- Game Socket ------------------------

gameSocket.on("connection", (socket) => {

  socket.on('join game', (room) => {
    socket.join(room)
    console.log("User joined room: " + room);
  })
  
  socket.on('send request', (data) => {
    const { name, roomid } = data
    socket.to(roomid).emit('give response', name)
  })

  socket.on('request accepted', (data) => {
    socket.to(data).emit('accept response')
  })

  socket.on('decline request', (data) => {
    socket.to(data).emit('decline response')
  })

  socket.on('close game', (data) => {
    socket.to(data).emit('close game response')
  })

  socket.on('move', (data) => {
    //console.log(data);
    const { roomid, index, board, value } = data;
    board[index] = value
    socket.to(roomid).emit('update', board);

    const winner = checkWinner(board);
    if (winner) {
      gameSocket.to(roomid).emit('gameOver', winner);
    }

  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
})
