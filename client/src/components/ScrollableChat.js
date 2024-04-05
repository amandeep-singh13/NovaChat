import React, { useContext } from "react";
import { Tooltip, Avatar } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { ThemeContext } from "../Context/ThemeContext";
import { MdDelete } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";
import { RiThumbUpLine, RiThumbDownLine, RiHeartLine } from "react-icons/ri";

const ScrollableChat = ({ messages, handleDelete, handleReact }) => {
  const { user } = ChatState();
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.username}
                placement="bottom-start"
                hasArrow
              >
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
                theme === "dark" ? "text-black bg-opacity-50" : "text-black"
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
              <div style={{ display: "flex", marginTop: "5px" }}>
                <IconButton
                  icon={<RiThumbUpLine style={{ color: "blue" }} />}
                  aria-label="Like"
                  onClick={() => handleReact(m._id, "like")} // handleReact function to be implemented
                  variant={
                    m.reactions &&
                    m.reactions.some(
                      (r) => r.reactionType === "like" && r.userId === user._id
                    )
                      ? "solid"
                      : "outline"
                  }
                />
                <IconButton
                  icon={<RiThumbDownLine style={{ color: "red" }} />}
                  aria-label="Dislike"
                  onClick={() => handleReact(m._id, "dislike")} // handleReact function to be implemented
                  variant={
                    m.reactions &&
                    m.reactions.some(
                      (r) =>
                        r.reactionType === "dislike" && r.userId === user._id
                    )
                      ? "solid"
                      : "outline"
                  }
                />
                <IconButton
                  icon={<RiHeartLine style={{ color: "#ff1493" }} />}
                  aria-label="Heart"
                  onClick={() => handleReact(m._id, "heart")} // handleReact function to be implemented
                  variant={
                    m.reactions &&
                    m.reactions.some(
                      (r) => r.reactionType === "heart" && r.userId === user._id
                    )
                      ? "solid"
                      : "outline"
                  }
                />
              </div>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
