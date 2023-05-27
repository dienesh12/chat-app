import React, { useEffect, useState } from 'react'
import Square from './Square'
import { Socket } from 'socket.io-client';
import { ChatState } from '../../Context/chatProvider';

const Grid = (props) => {

  const socket = props.socket

  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const updateSqaure = ( square ) => {
    if (board[square] === '') {
      // Send the selected cell to the server
      socket.emit('move', square);
    }
  }

  useEffect(() => {
    socket.on('update', (state) => {
      setBoard(state);
    });

    // Handle game over event
    socket.on('gameOver', (winner) => {
      alert(`Game over! Winner: ${winner}`);
      setBoard(Array(9).fill(''));
    });

  }, []);

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