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

let state = Array(9).fill(''); 
let currentPlayer = 'X';


function checkWinner() {
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

    socket.emit('update', state);

    socket.on('move', (index) => {
      if (state[index] === '' && currentPlayer) {
        state[index] = currentPlayer;
  
        // Send the updated game state to the client
        socket.emit('update', state);
  
        const winner = checkWinner();
        if (winner) {
          // Notify the client about the game result
          socket.emit('gameOver', winner);
          state = Array(9).fill('');
        } else {
          // Switch the current player
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      }
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

