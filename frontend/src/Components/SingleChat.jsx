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
import CryptoJS from 'crypto-js'

var chatSocket, gameSocket, selectedChatCompare

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

        const { data } = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/message/${selectedChat._id}`, config)


        setMessages(data)
        setLoading(false)
        chatSocket.emit('join chat', selectedChat._id)
        gameSocket.emit('join game', selectedChat._id)
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

            const chatId = selectedChat._id

            const key = CryptoJS.enc.Utf8.parse(chatId)
            const iv1 = CryptoJS.enc.Utf8.parse(chatId)
            const encrypted = CryptoJS.AES.encrypt(newMessage, key, {
                keySize: 16,
                iv: iv1,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })

            const encryptedMessage = encrypted + ""

            const { data } = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/message`, {
                chatId: selectedChat._id,
                content: encryptedMessage
            }, config)

            setMessages([...messages, data])
            chatSocket.emit("new message", data)
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
    chatSocket = io(process.env.REACT_APP_END_POINT_CHAT)
    gameSocket = io(process.env.REACT_APP_END_POINT_GAME)
    chatSocket.emit("setup", user)
    chatSocket.on("connection", () => setSocketConnected(true))
  }, [])

  const typingHandler = (e) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  }, [selectedChat]) //Whenever user changes the chat it is called.

  useEffect(() => {
    chatSocket.on("message recieved", (newMessageRecieved) => {
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
                        <TicTacToe gameSocket = { gameSocket }/>
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