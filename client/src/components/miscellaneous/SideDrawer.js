import React, { useState } from 'react';
import axios from "axios";
import { Button } from "@chakra-ui/button";
import UserListItem from "../UserAvatar/UserListItem";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider"
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import { getSender } from '../../config/ChatLogics';
//import {Effect} from 'react-notification-Badge';
//import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };


  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/register?search=${search}`, config);
      setLoading(false);
      setsearchResult(data);
    }
    catch (error) {
      toast({
        title: "Error occured!",
        description: "Search failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }
    catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  return <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="8px 10px 15px 10px"
      borderWidth="5px"
      backgroundImage="url('.../Images/image1.jpg')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Tooltip label="Choose your fav one.." hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text fontSize='18px' d={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize='25px' fontFamily="Work sans" pr={15}>
        NovaChat
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            {/* <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
            /> */}
          <BellIcon fontSize="2x1" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length &&"No New Messages"}
            {notification.map(notif=>(
              <MenuItem key={notif._id} onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}>
                {notif.chat.isGroupChat?`New message in ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
          </Menu>
          <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.username}
              src={user.profile}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>{" "}
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
    <Drawer placement="left" width="30%" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent width="30%">
        <DrawerHeader borderBottomWidth="1px" width="20%">Search User</DrawerHeader>
        <DrawerBody width="40%">
          <Box d="flex" pb={30}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSearch}>Go</Button>
          </Box>
          <Box width="40%" h="100vh">
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" d="flex" />}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>
};

export default SideDrawer;