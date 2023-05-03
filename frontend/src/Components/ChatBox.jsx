import React from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const { selctedChat } = ChatState()

  return (
    <Box
      display={{ base: selctedChat ? "none" : "flex", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="black"
      w={{ base: "100%", md: "68%" }}   
      borderRadius="lg"
      borderWidth="1px"   
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox