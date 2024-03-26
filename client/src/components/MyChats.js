import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import { getSender } from "../config/ChatLogics"
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import UserBadgeItem from "./UserAvatar/UserBadgeItem";
const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("./api/chat", config);
      setChats(data);
    }
    catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])
  return (
    <Box className="bg-white"
      pb={3}
      px={2}
      flexDir={"row"}
      // d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      // flexDir="column"
      alignItems="center"
      p={3}
      // w={{ base: "100%", md: "31%" }}
      w="30%"
      borderRadius="lg"
      borderWidth="1px"
      fontSize={{ base: "40px", md: "30px" }}
      fontFamily="Work sans"
      justifyContent="space-between"
    >
      <Box className="flex bg-gray-200">
      My Chats
      <GroupChatModal>
        <Button className="flex-row-reverse" bg="#E8E8E8"
          fontSize={{ base: "40px", md: "30px" }}
          pr={4}
          pl={4}
          rightIcon={<AddIcon />}

        >New Group Chat</Button>
      </GroupChatModal>
      </Box>
      <Box className="bg-white"
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="95vh"
        borderRadius="xl"
      >
        {/* scroller introduced */}
        {chats ? (
          <Stack overflow="scroll" height="98vh" className="bg-white">
            {chats.map((chat) => (
              <Box
                className="rounded-lg h-10"
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={setSelectedChat === chat ? "#38B2AC" : "#E9E9E9"}
                color={setSelectedChat === chat ? "white" : "black"}
                px={3}
                py={4}
                
                
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (<ChatLoading />)}
      </Box>
    </Box>
  )
}

export default MyChats;