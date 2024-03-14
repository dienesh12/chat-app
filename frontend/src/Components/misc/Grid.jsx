import React, { useEffect, useState } from 'react'
import Square from './Square'
import { ChatState } from '../../Context/chatProvider';

const Grid = (props) => {

  const socket = props.socket

  const { user, selectedChat, currentPlayer, setCurrentPlayer } = ChatState()
  const roomID = selectedChat._id
  const users = selectedChat.users
  let value = (users[1]._id === user._id) ? 'X' : 'O'
  const oppId = users[1]._id === user._id ? users[0]._id : users[1]._id

  const [board, setBoard] = useState(Array(9).fill(''));

  const updateSqaure = ( index ) => {
    // console.log("user._id: ", user._id, "current: ", currentPlayer)
    if (board[index] === '' && user._id === currentPlayer) {
      //console.log(board)
      const roomid = roomID
      //console.log(user._id, oppId)
      setBoard(board)
      setCurrentPlayer(oppId)
      board[index] = value
      socket.emit('move', {roomid, index, board, value});
    }
  }

  useEffect(() => {
    socket.on('update', (state) => {
      //console.log("update called")
      setBoard(state);
      setCurrentPlayer(user._id)
    });
  }, []);

  useEffect(() => {
    socket.on('gameOver', (winner) => {
      alert(`Game over! Winner: ${winner}`);
      setBoard(Array(9).fill(''));
    });
  }, [])

  return (
    <>
        <div className='grid'>
            <div className='row'>
                <Square val={ board[0] } updateSquare={ () => updateSqaure(0) } />
                <Square val={ board[1] } updateSquare={ () => updateSqaure(1) } />
                <Square val={ board[2] } updateSquare={ () => updateSqaure(2) } />
            </div>
            <div className='row'>
                <Square val={ board[3] } updateSquare={ () => updateSqaure(3) } />
                <Square val={ board[4] } updateSquare={ () => updateSqaure(4) } />
                <Square val={ board[5] } updateSquare={ () => updateSqaure(5) } />
            </div>
            <div className='row'>
                <Square val={ board[6] } updateSquare={ () => updateSqaure(6) } />
                <Square val={ board[7] } updateSquare={ () => updateSqaure(7) } />
                <Square val={ board[8] } updateSquare={ () => updateSqaure(8) } />
            </div>
        </div>
    </>
  )
}

export default Grid