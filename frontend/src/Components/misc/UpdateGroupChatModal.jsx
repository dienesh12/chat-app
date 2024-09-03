import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()

    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleGroup = async (userToAdd) => {
        if(selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User Already Exists!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins can Add!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`${process.env.REACT_APP_BACK_URL}/api/chat/add`, {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }
    }

    const handleRemove = async (userToRemove) => {
        if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only Admins can Remove!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }
           
        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            
            const { data } = await axios.put(`${process.env.REACT_APP_BACK_URL}/api/chat/remove`, {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config)

            userToRemove._id === user._id ? setSelectedChat() : selectedChat(data)
            fetchMessages()
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if(!groupChatName) return

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`${process.env.REACT_APP_BACK_URL}/api/chat/rename`, {
                chatID: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

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

  return (
    <>
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} color="orange" />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >{ selectedChat.chatName }</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3} >
                    {selectedChat.users.map((u) => {
                        return <UserBadgeItem key={user._id} user={u} handleFunction={() => handleRemove(u)} />
                    })}
                </Box>
                <FormControl display="flex">
                    <Input 
                        placeholder="Chat Name"
                        mb={3}
                        value={ groupChatName }
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant="solid"
                        bg="orange"
                        color="black"
                        ml={1}
                        isLoading={ renameLoading }
                        onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)}/>
                </FormControl>
                {loading ? <Spinner size="lg"/>
                : searchResult?.slice(0, 4).map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))}
            </ModalBody>

            <ModalFooter>
            <Button onClick={() => handleRemove(user)} bg="orange" color="black">
                Leave Group
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}

export default UpdateGroupChatModal