import React, {useContext} from 'react'
import { Tooltip, Avatar } from '@chakra-ui/react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender,isSameSenderMargin,isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import {ThemeContext} from '../Context/ThemeContext'
import {MdSend,MdDelete} from "react-icons/md";
import { IconButton } from "@chakra-ui/react";
const ScrollableChat = ({messages,handleDelete}) => {
    const {user}=ChatState();
    const {theme} = useContext(ThemeContext)
    return (
        <ScrollableFeed>
          {messages &&
            messages.map((m, i) => (
              <div style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.username} placement="bottom-start" hasArrow>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.username}
                      src={m.sender.profile}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                  className={`rounded-lg ${
                    theme === 'dark' ? 'text-black bg-opacity-50' : 'text-black'
                }`}
                >
                  {m.content}
                  {user._id === m.sender._id && (
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Delete message"
                  onClick={() => handleDelete(m._id)}
                />
              )}
                </span>
              </div>
            ))}
        </ScrollableFeed>
      );
    };
    
  export default ScrollableChat;
