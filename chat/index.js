const express = require("express")
const path = require("path")
const { Server } = require("socket.io")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 9000

const httpServer = app.listen(PORT, () => {
    console.log(`Chat Server is up and running on PORT ${PORT}!`)
})

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

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

io.on("connection", (socket) => {
    //console.log("Connected to Socket.io")
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        //console.log(userData._id);
        socket.emit("Connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        roomid = room
        //console.log("User joined room: " + room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id === newMessageRecieved.sender._id) return 
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })

    //  ---------------------------- Game Socket ------------------------

    socket.on('send request', (data) => {
      const { name, roomid } = data
      socket.to(roomid).emit('give response', name)
    })

    socket.on('request accepted', () => {
      socket.to(roomid).emit('accept response')
    })

    socket.on('decline request', () => {
      socket.to(roomid).emit('decline response')
    })

    socket.on('close game', () => {
      socket.to(roomid).emit('close game response')
    })
  
    socket.on('move', (data) => {
      //console.log(data);
      const { roomid, index, board, value } = data;
      board[index] = value

      socket.to(roomid).emit('update', board);
  
      const winner = checkWinner(board);
      if (winner) {
        io.to(roomid).emit('gameOver', winner);
      }

    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
})
