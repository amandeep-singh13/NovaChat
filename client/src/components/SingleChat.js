import React,{useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Text, Box } from '@chakra-ui/layout';
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import { useEffect } from 'react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { Form } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import "./Style.css";
import io from 'socket.io-client'
const ENDPOINT = "http://localhost:8080";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected,setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const toast = useToast();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
      }, []);

      useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=> {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
               if(!notification.includes(newMessageRecieved)){
                setNotification([newMessageRecieved,...notification]);
                setFetchAgain(!fetchAgain);
               } 
    
            }else {
                setMessages([...messages,newMessageRecieved]);
            }
          });
    })
    
    
    const sendMessage=async (event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id);
            try{
                const config={
                    headers:{
                        "Content-type":"application/json",
                        Authorization:`Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
            const {data}=await axios.post(
                '/api/message/messages',
                {
                    content:newMessage,
                    chatId:selectedChat._id,
                },
                config
            );
            //console.log(data);
            socket.emit('new message', data)
            setMessages([...messages,data]);
            }
            catch(error){
                toast({
                    title:"Error Occurred!",
                    description:"Falied to send Message",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom"
                });
            }
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
      if(!selectedChat) return;
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
            socket.emit('join chat',selectedChat._id);
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
    console.log(messages);
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    

   
    
    return <>
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
                >
                    <IconButton
                        d={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />

                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal
                                user={getSenderFull(user, selectedChat.users)}
                            />
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
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                // overflowY="hidden"
                >
                    {loading?(<Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                    />):(<div className='messages' style={{ maxHeight: '92%', overflowY: 'auto' }}>
                        <ScrollableChat messages={messages}/>
                    </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
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
                        className="rounded-lg p-3 "
                        position="fixed" // Use position fixed
                        bottom="10" // Stick it to the bottom
                        zIndex="99" 
                        w="100%"
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message.."
                        onChange={typingHandler}
                        value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box d="flex" alignItems="center" justifyContent="center" h="100%" >
                <Text fontSize="3xl"
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    Click on user to start chatting.


                </Text>
            </Box>
        )}
    </>
}

export default SingleChat