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

var socket

const TicTacToe = ( props ) => {

  const toast = useToast()

  socket = props.socket

  console.log(socket);

  const { user, selectedChat } = ChatState()
  const [opponent, setOpponent] = useState("")
  const roomID = selectedChat._id

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()

  const joinRoom = () => {
    if (roomID) {
      socket.emit('joinGame', roomID);
    }
  }

  const handleClick = async () => {
    const users = selectedChat.users
    const loggedUser = user
    const userId = users[1]._id === loggedUser._id ? users[0]._id : users[1]._id

    const { data } = await axios.get(`http://localhost:5005/api/user/isActive/${userId}`)

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

    const val = {
      name: user.name,
      roomid: selectedChat._id
    }
    
    socket.emit("send request", val)
  }

  const handleJoinGame = () => {
    onOpen2()
    onClose1()
    joinRoom()

    socket.emit("request accepted")
  }

  useEffect(() => {
    socket.on('give response', (name) => {
      setOpponent(name)
      onOpen1()
    })
    socket.on('accept response', () => {
      onOpen2()
      onClose1()
      joinRoom()
    })
  })

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
            <Button onClick={onClose1}>Decline</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


        <Modal isOpen={isOpen2} onClose={onClose2}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Tic-Tac-Toe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid socket={ socket }/>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose2}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default TicTacToe