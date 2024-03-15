import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import {getSender} from "../config/ChatLogics"
import { ChatState } from "../Context/ChatProvider";
const MyChats = ({ fetchAgain }) => {

  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat, setSelectedChat, user, chats,    setChats} = ChatState();
  const toast=useToast();
  const fetchChats=async()=>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };
      const {data}=await axios.get("./api/chat",config);
      setChats(data);
    }
    catch(error){
      toast({
        title:"Error occured!",
        description:"Failed to load the chats",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
      });
    }
  };
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain])
  return (
    <Box 
    d={{base:selectedChat?"none": "flex",md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    w={{base:"100%" ,md:"31%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box
        pb={3}
        px={2}
        fontSize={{ base: "40px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >My Chats
      <Button bg="#E8E8E8"
      d="flex"
      fontSize={{base: "40px", md: "30px"}}
      pr={10}
      pl={4}
      flexDir={"row-reverse"}
      rightIcon={<AddIcon/>}
      >New Group Chat</Button>
      <Box
      d="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="30%"
      h="100vh"
      borderRadius="xl"
      >
        {chats?(
          <Stack overflow="scroll" height="100vh">
            {chats.map((chat)=>(
              <Box
              onClick={()=>setSelectedChat(chat)}
              cursor="pointer"
              bg={setSelectedChat===chat?"#38B2AC":"#A9A9A9"}
              color={setSelectedChat===chat?"white":"black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat? getSender(loggedUser,chat.users):chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(<ChatLoading/>)}
      </Box>
    </Box>
    </Box>
  )
}

export default MyChats;