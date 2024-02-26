import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast, Icon } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getFullUser } from '../config/ChatLogics'
import ProfileModal from './misc/ProfileModal'
import UpdateGroupChatModal from './misc/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import TicTacToe from './misc/TicTacToe'
import io from 'socket.io-client'

const END_POINT = "http://localhost:9000"
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

  const toast = useToast()

  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const { data } = await axios.get(`http://localhost:5005/api/message/${selectedChat._id}`, config)


        setMessages(data)
        setLoading(false)
        socket.emit('join chat', selectedChat._id)
    } catch (error) {
        toast({
            title: "Error Occured",
            description: "Unable to fetch messages.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
    }
  }

  const sendMessage = async (event) => {
    if(event.key === "Enter" && newMessage){
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            setNewMessage("")

            const { data } = await axios.post(`http://localhost:5005/api/message`, {
                chatId: selectedChat._id,
                content: newMessage
            }, config)

            setMessages([...messages, data])
            socket.emit("new message", data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Unable to send message.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }
  }

  useEffect(() => {
    socket = io(END_POINT)
    socket.emit("setup", user)
    socket.on("connection", () => setSocketConnected(true))
  }, [])

  const typingHandler = (e) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  }, [selectedChat]) //Whenever user changes the chat it is called.

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
            if(!notification.includes(newMessageRecieved)) {
                setNotification([newMessageRecieved, ...notification])
                setFetchAgain(!fetchAgain)
            }
        } else {
            setMessages([...messages, newMessageRecieved])
        }
    })
  })

  return (
    <>
        {selectedChat ? ( 
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                        color="orange"
                    />
                    {!selectedChat.isGroupChat ? (
                      <>
                        <Text color="orange">{getSender(user, selectedChat.users)}</Text>
                        <TicTacToe socket = { socket }/>
                        <ProfileModal user={getFullUser(user, selectedChat.users)}/>
                      </>
                    ) : (<> 
                            <Text color="orange">{selectedChat.chatName.toUpperCase()}</Text>
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} ></UpdateGroupChatModal>
                        </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    { loading ? ( 
                        <Spinner 
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        /> )
                        : (
                        <>
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        </> 
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input 
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder='Enter a Message'
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </> 
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" fontFamily="Work sans" color="white">
                    Click on a user to start Chat
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat