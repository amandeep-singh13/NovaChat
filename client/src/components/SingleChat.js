import React, { useState, useContext } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Text, Box } from "@chakra-ui/layout";
import { FormControl } from "@chakra-ui/form-control";
import EmojiPicker from "emoji-picker-react"; // Import EmojiPicker component
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { useEffect } from "react";
import { ArrowBackIcon, EmailIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { Form } from "react-router-dom";
import Lottie from "react-lottie";
import { ThemeContext } from "../Context/ThemeContext";
import animationData from "../animations/typing.json";
import "./Style.css";
import { MdSend, MdDelete } from "react-icons/md";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { theme } = useContext(ThemeContext);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // Define showEmojiPicker state variable and setShowEmojiPicker function
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    // Other socket event listeners...
    socket.on("add reaction", handleAddReaction);
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  //console.log(notification, "-------------");
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        const hasReactions = newMessageRecieved.reactions &&
          newMessageRecieved.reactions.length > 0;
        // If the new message contains reactions, handle adding them
        if (hasReactions) {
          handleAddReaction(newMessageRecieved);
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      }
    });
  });
  // Inside the useEffect hook for listening to 'message deleted' event
  useEffect(() => {
    socket.on("message deleted", (deletedMessageId) => {
      // Filter out the deleted message from the messages state
      setMessages((messages) =>
        messages.filter((message) => message._id !== deletedMessageId)
      );
    });
  }, []);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };
  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message/messages",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const handleDelete = async (messageId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/message/deleteMessage/${messageId}`, config);
      console.log(`Deleted message with ID: ${messageId}`);
      // Emit the "delete message" event
      socket.emit("delete message", { messageId, chatId: selectedChat._id });
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddReaction = (data) => {
    const { messageId, reactionType } = data;
    const updatedMessages = messages.map((message) => {
      if (message._id === messageId) {
        return { ...message, reactions: [...message.reactions, { reactionType }] };
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  const handleReact = async (messageId, reactionType) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Make a POST request to add reaction
      await axios.post("/api/message/addReaction", { messageId, reactionType }, config);
      // Emit the 'add reaction' event to the server
      socket.emit("add reaction", { messageId, reactionType });
    } catch (error) {
      // Handle error...
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      setNotification(
        notification.filter((n) => n.chat._id !== selectedChat._id)
      );
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const onEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    if (emoji) {
      setNewMessage((prevMessage) => prevMessage + emoji);
    }
  };
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
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            className={`${theme === "dark" ? "text-white" : "text-black"}`}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
            w="100%"
            h="100%"
            borderRadius="lg"
            // overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                className="messages"
                style={{ maxHeight: "92%", overflowY: "auto" }}
              >
                <ScrollableChat
                  messages={messages}
                  handleDelete={handleDelete}
                  handleReact={handleReact}
                />
              </div>
            )}
            <FormControl isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                className={`rounded-lg p-3 ${
                  theme === "dark" ? "bg-gray-700 text-white" : "text-black"
                }`}
                position="fixed"
                bottom="10"
                zIndex="99"
                w="calc(100% - 60px)"
                variant="filled"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={handleKeyDown}
              />
              <div style={{ position: "relative" }}>
                <button
                  style={{
                    position: "fixed",
                    right: "50px",
                    bottom: "16px",
                    zIndex: "100",
                    fontSize: "23px",
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😀
                </button>
                {showEmojiPicker && (
                  <div
                    style={{
                      position: "absolute",
                      right: "10px",
                      bottom: "40px",
                      zIndex: "101",
                    }}
                  >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <IconButton
                className="mb-2 p-2 bg-gray-400 rounded-md"
                aria-label="Send message"
                icon={<MdSend />}
                colorScheme="blue"
                onClick={handleSend}
                position="fixed"
                right="10"
                bottom="11"
                zIndex="99"
                borderRadius="full"
                fontSize="28px"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text
            fontSize="3xl"
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} ${
              theme === "dark" ? "text-white" : "text-black"
            }`} // Apply dynamic background color and text color based on theme
          >
            Click on user to start chatting.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
