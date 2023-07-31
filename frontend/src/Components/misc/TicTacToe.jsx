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
    ModalBody
} from '@chakra-ui/react'
import { GiTicTacToe } from "react-icons/gi";
import Grid from './Grid';
import { ChatState } from '../../Context/chatProvider';

const END_POINT = "http://localhost:5005"
var socket

const TicTacToe = ( props ) => {

  socket = props.socket

  console.log(socket);

  const { selectedChat } = ChatState()
  const roomID = selectedChat._id

  const { isOpen, onOpen, onClose } = useDisclosure()

  const joinRoom = () => {
    if (roomID) {
      socket.emit('joinGame', roomID);
    }
  }

  const handleClick = () => {
    onOpen()
    joinRoom()
  }

  return (
    <>
        <IconButton as = { GiTicTacToe } onClick={handleClick}/>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
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