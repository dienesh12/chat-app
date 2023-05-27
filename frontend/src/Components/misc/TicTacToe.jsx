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

const END_POINT = "http://localhost:5005"
var socket

const TicTacToe = ( props ) => {

  socket = props.socket

  console.log(socket);

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
        <IconButton as = { GiTicTacToe } onClick={ onOpen }/>

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