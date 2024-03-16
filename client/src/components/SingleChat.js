import React,{useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Text, Box } from '@chakra-ui/layout';
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket,setSocket] = useState(null);
    const toast = useToast();
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
                //overflowY="hidden"
                >

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