import React, { useEffect } from 'react'
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
  const roomID = selectedChat._id

  const { isOpen, onOpen, onClose } = useDisclosure()

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
    
    onOpen()
    joinRoom()
  }

  return (
    <>
        <IconButton as = { GiTicTacToe } onClick={handleClick}/>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Tic-Tac-Toe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid socket={ socket }/>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default TicTacToe