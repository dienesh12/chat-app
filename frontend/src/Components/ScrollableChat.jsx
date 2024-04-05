import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'
import CryptoJS from 'crypto-js'

const ScrollableChat = ({ messages }) => {

  const { user, selectedChat } = ChatState()

  const decryptData = (encryptedMessage) => {
    const chatId = selectedChat._id

    const key = CryptoJS.enc.Utf8.parse(chatId)
    const iv1 = CryptoJS.enc.Utf8.parse(chatId)
    const message = CryptoJS.AES.decrypt(encryptedMessage, key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })

    return message.toString(CryptoJS.enc.Utf8);
  }

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
                { decryptData(msg.content) }
              </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat