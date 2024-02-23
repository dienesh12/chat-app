import { Box, Button, Menu, MenuButton, MenuList, MenuItem, Text, Tooltip, useDisclosure, useToast, Input } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../Context/chatProvider.js'
import React, { useState } from 'react'
import ProfileModal from './ProfileModal.jsx'
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import ChatLoading from '../ChatLoading.jsx'
import UserListItem from '../UserAvatar/UserListItem.jsx'
import { getSender } from '../../config/ChatLogics.jsx'

const SideDrawer = () => {

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler = async () => {
    localStorage.removeItem("userInfo")
    await axios.put(`http://localhost:5005/api/user/logout/${user._id}`)
    navigate("/")
  }

  const handleSearch = async () => {
    if(!search) {
      toast({
        title: "Please Enter Something in the Search field!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.get(`http://localhost:5005/api/user?search=${search}`, config)

      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch(error) {
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type" : "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.post(`http://localhost:5005/api/chat`, { userId }, config)

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch(error) {
        toast({
          title: "Error Fetching the Chat!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
    }
  }

  return(
    <>
      <Box
        display="flex"
        justifyContent="space-between"  
        alignItems="center"
        bg="rgba(0, 0, 0, 0.911)"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
          <Button color="orange" variant='ghost' onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4" color="orange">Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans" color="orange">Chatter</Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} color="orange"/>
              <span class="badge" style={{color:"orange"}}>{notification.length}</span>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter((n) => n !== notif))
                }}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                                          : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={ logoutHandler }>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="black" color="orange">
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex"pb={2} >
              <Input 
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>GO!</Button>
            </Box>
            {loading ? (
              <ChatLoading/>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              )) 
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer