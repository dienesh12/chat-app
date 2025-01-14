import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    ModalBody,
    useToast
} from '@chakra-ui/react'
import { GiTicTacToe } from "react-icons/gi";
import Grid from './Grid';
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import { io } from 'socket.io-client';

var socket

const TicTacToe = (props) => {

  const toast = useToast()
  socket = props.gameSocket
  // console.log(socket);

  const { user, selectedChat, currentPlayer, setCurrentPlayer } = ChatState()
  const [opponent, setOpponent] = useState("")
  const [loading, setLoading] = useState(false)
  const roomID = selectedChat._id

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

  const handleClick = async () => {
    const users = selectedChat.users
    const loggedUser = user
    const userId = users[1]._id === loggedUser._id ? users[0]._id : users[1]._id

    const { data } = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/user/isActive/${userId}`)

    if(!data.isActive) {
      toast({
        title: `${data.name} is Not Active`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return
    }

    setLoading(true)
    onOpen2()

    const val = {
      name: user.name,
      roomid: selectedChat._id
    }
    
    socket.emit("send request", val)
  }

  const handleJoinGame = () => {
    onClose1()
    onOpen2()
    socket.emit("request accepted", roomID)
  }

  const handleDecline = () => {
    onClose1()
    socket.emit('decline request', roomID)
  }

  const handleCloseGame = () => {
    onClose2()
    socket.emit('close game', roomID)
  }

  useEffect(() => {
    socket.on('give response', (name) => {
      console.log("socket reached")
      setOpponent(name)
      onOpen1()
    })
  }, [])

  useEffect(() => {
    socket.on('accept response', () => {
      onClose1()
      setLoading(false)
      setCurrentPlayer(user._id)
      onOpen2()
    })
  }, [])

  useEffect(() => {
    socket.on('decline response', () => {
      toast({
        title: `${opponent} declined your request`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      onClose2()
    })
  }, [])

  useEffect(() => {
    socket.on('close game response', () => {
      toast({
        title: `${opponent} closed game`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      onClose1()
      onClose2()
    })
  }, [])

  return (
    <>
        <IconButton as = { GiTicTacToe } onClick={handleClick}/>

        <Modal onClose={onClose1} size={'sm'} isOpen={isOpen1}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {opponent} requested for a match
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleJoinGame}>Join Game</Button>
            <Button onClick={handleDecline}>Decline</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


        <Modal isOpen={isOpen2} onClose={onClose2}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Tic-Tac-Toe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {
                loading ? <h1>Waiting for {(selectedChat.users[1]._id === user._id) ? selectedChat.users[0].name : selectedChat.users[1].name}...</h1>
                        : <Grid socket={ socket }/>
              }
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleCloseGame}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default TicTacToe