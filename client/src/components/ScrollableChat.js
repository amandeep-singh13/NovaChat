import React, { useContext } from "react";
import { Tooltip, Avatar, IconButton } from "@chakra-ui/react";
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
// import {
//   RiThumbUpLine,
//   RiThumbDownLine,
//   RiHeartLine,
// } from "react-icons/ri";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const ScrollableChat = ({
  messages,
  handleDelete,
  likePost,
  dislikePost,
  heartPost,
  disHeartPost,
}) => {
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
                  icon={
                    m.likes.includes(user._id) ? (
                      <FaThumbsUp style={{ color: "blue" }} />
                    ) : (
                      <FaRegThumbsUp />
                    )
                  }
                  aria-label="Like"
                  onClick={() =>
                    m.likes.includes(user._id)
                      ? dislikePost(m._id)
                      : likePost(m._id)
                  }
                  variant="solid"
                />
                <IconButton className="ml-1"
                  icon={
                    m.heart.includes(user._id) ? (
                      <FaHeart style={{ color: "red" }} />
                    ) : (
                      < CiHeart />
                    )
                  }
                  aria-label="Heart"
                  onClick={() =>
                    m.heart.includes(user._id)
                      ? disHeartPost(m._id)
                      : heartPost(m._id)
                  }
                  variant="solid"
                />

                {/* <IconButton
                  icon={<RiThumbDownLine style={{ color: "red" }} />}
                  aria-label="Dislike"
                  onClick={() => dislikePost(m._id)} // Call dislikePost function with message ID
                  variant={
                    m.dislikes && m.dislikes.includes(user._id)
                      ? "solid"
                      : "outline"
                  }
                /> */}
                {/* <IconButton
                  icon={<RiHeartLine style={{ color: "#ff1493" }} />}
                  aria-label="Heart"
                  onClick={() => heartPost(m._id)} // Call heartPost function with message ID
                  variant={
                    m.hearts && m.hearts.includes(user._id)
                      ? "solid"
                      : "outline"
                  }
                />
                <IconButton
                  icon={<RiHeartLine style={{ color: "#ff1493" }} />} // Assuming disheart uses the same icon
                  aria-label="Disheart"
                  onClick={() => disHeartPost(m._id)} // Call disHeartPost function with message ID
                  variant={
                    m.dishearts && m.dishearts.includes(user._id)
                      ? "solid"
                      : "outline"
                  }
                /> */}
              </div>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
