import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {

  const { user } = ChatState()

  return (
    <ScrollableFeed className='scroll'>
        { messages && messages.map((msg, ind) => (
            <div style={{ display: "flex" }} key={ msg._id } >
              {(isSameSender(messages, msg, ind, user._id) || isLastMessage(messages, ind, user._id)) && (
                <Tooltip
                  label={ msg.sender.name }
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={ msg.sender.name }
                    src={ msg.sender.pic }
                  />
                </Tooltip>
              )}
              <span 
                style={{ backgroundColor: `${ msg.sender._id === user._id ? "#FFA500" : "#F08000" }`,
                borderRadius: "20px",
                padding: "5px 10px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, msg, ind, user._id),
                marginTop: isSameUser(messages, msg, ind)
              }}>
                { msg.content }
              </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat