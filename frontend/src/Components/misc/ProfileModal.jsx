import { IconButton, useDisclosure, Button, Image, Text } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
        { children ? <span onClick={onOpen}>{ children }</span>
                   : <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} color="orange" />}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                  fontSize="40px"
                  fontFamily="Work sans"
                  display="flex"
                  justifyContent="center"
                > { user.name }
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={ user.pic }
                    alt={ user.name }
                  />
                  <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
                    Email: { user.email }
                  </Text>
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

export default ProfileModal