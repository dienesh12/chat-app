import React from 'react'
import { IconButton, useDisclosure, Button, Image, Text, useToast, FormControl, Input, Box } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState()
  const [searchResults, setSearchResult] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const[loading, setLoading] = useState()

  const toast = useToast()

  const { user, chats, setChats } = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if(!query) {
        return
    }

    try {
        setLoading(true)

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const { data } = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/user?search=${search}`, config)

        // console.log(data)
        setLoading(false)
        setSearchResult(data)
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to get the search results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
    }
  }

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers) {
        toast({
            title: "Please Fill all Fields!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
        })
        return
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const { data } = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/chat/group`, {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id))
        }, config)

        setChats([data, ...chats])
        onClose()
        toast({
            title: "Group Chat Created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top"
        }) 
    } catch (error) {
        toast({
            title: "Failed to create a groupt Chat",
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        }) 
    }
  }

  const handleGroup = (userToAdd) => {
    if(selectedUsers?.includes(userToAdd)) {
        toast({
            title: "User Already Exists!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
        })
        return
    }
    
    setSelectedUsers([...selectedUsers, userToAdd])

  }

  const handleDelete = (userToDelete) => {
    if(selectedUsers) setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id))
  }

  return (
    <>
      <span onClick={onOpen}>{ children }</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)}/>
            </FormControl>
          </ModalBody>
          {/*Selected Users*/}
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers?.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
            ))}
          </Box>

          {/* Render search results */}
          {loading ? <div>Loading...</div>
                : searchResults?.slice(0, 4).map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))}
          <ModalFooter>
            <Button colorScheme='orange' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal