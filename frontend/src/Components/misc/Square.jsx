import React from 'react'

const Square = ({ updateSquare, val }) => {
  return (
    <div className='square' onClick={ updateSquare }>
        { val }
    </div>
  )
}

export default Square