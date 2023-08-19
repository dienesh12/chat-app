import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/chatProvider'
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import axios from 'axios'
import ChatLoading from './ChatLoading.jsx'
import { getSender } from '../config/ChatLogics.jsx'
import GroupChatModal from './misc/GroupChatModal'

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState()
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`https://chatter-qfh1.onrender.com/api/chat`, config)
      console.log(data)
      setChats(data)
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Unable to fetch all the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="black"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "20px", md: "24px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItem="center"
          color="orange"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="black"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats?(
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={ ()=>setSelectedChat(chat) }
                  cursor="pointer"
                  bg={ selectedChat === chat ? "orange" : "white" }
                  color={ selectedChat === chat ? "white" : "black" }
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {loggedUser && !chat.isGroupChat ? (
                      getSender(loggedUser, chat.users)
                    ) : chat.chatName }
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  )
}

export default MyChats