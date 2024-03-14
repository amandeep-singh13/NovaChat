import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import {getSender} from "../config/ChatLogics"
import { useChatState } from "../Context/ChatProvider";
const MyChats = () => {

  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,chats,setChats}=useChatState();
  const toast=useToast();
   const user=localStorage.getItem("userInfo");
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
  },[])
  return (
    <Box 
    d={{base:selectedChat?"none": "flex",md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base:"100%" ,md:"31%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >My Chats
      <Button
      d="flex"
      fontSize={{base:"17px", md:"10px", lg:"17px"}}
      rightIcon={<AddIcon/>}
      >New Group Chat</Button>
      
      </Box>
      <Box
      d="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
      >
        {chats?(
          <Stack overflow="scroll">
            {chats.map((chat)=>(
              <Box
              onClick={()=>setSelectedChat(chat)}
              cursor="pointer"
              bg={setSelectedChat===chat?"#38B2AC":"#E8E8E8"}
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
  )
}

export default MyChats;
