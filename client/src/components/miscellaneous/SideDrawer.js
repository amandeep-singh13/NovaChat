import React, { useState, useContext } from "react";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import {ModalCloseButton} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import UserListItem from "../UserAvatar/UserListItem";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
} from "@chakra-ui/menu"; // Import MenuDivider
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import { ThemeContext } from "../../Context/ThemeContext"; // Import the ThemeContext

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme context

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
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={theme === "dark" ? "black" : "#fff"} // Conditionally set background color based on theme
        color={theme === "dark" ? "white" : "black"} // Conditionally set text color based on theme
        w="100%"
        p="8px 10px 15px 10px"
        borderWidth="5px"
        backgroundImage="url('.../Images/image1.jpg')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        <Tooltip className="bg-green-300 rounded-md p-2" label="Choose your fav one.." hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text fontSize="18px" d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="25px" fontFamily="Work sans" pr={15}>
          NovaChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} pr={10}>
            <div style={{ position: 'relative' }}>
                {notification.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    textAlign: 'center',
                    fontSize: '12px',
                    lineHeight: '20px',
                  }}>
                    {notification.length}
                  </div>
                )}
              </div>
              <BellIcon fontSize="2x1" m={1} />
            </MenuButton>
            <MenuList pl={2} className={ `rounded-md p-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg={theme === "dark" ? "black" : "#fff"}
              rightIcon={<ChevronDownIcon />}
              color={theme === "dark" ? "white" : "black"}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.profile}
              />
            </MenuButton>
            <MenuList
              className = "p-2 pb-1 rounded-xl "
              bg={theme === "dark" ? "black" : "white"}
              color={theme === "dark" ? "white" : "black"}
            >
              <ProfileModal user={user}>
                <MenuItem className="bg-blue-400 rounded-xl p-1">My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider
                borderColor={theme === "dark" ? "black" : "white"}
              />
              <MenuItem  className="bg-green-400 rounded-xl p-1 mt-1 px-2" onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Box>

      <Drawer placement="left" width="30%" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent width="30%">
      <DrawerHeader className={`text-lg ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`} borderBottomWidth="1px" width="20%">
        Search User
      </DrawerHeader>
      <DrawerBody width="30%" className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <Box d="flex" pb={30}  >
          <Input
            className={`bg-gray-300 p-2 rounded-md mt-2 ${theme === 'dark' ? 'text-black' : 'text-black'}`}
            placeholder="Search by name or email"
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className={`bg-blue-400 p-2 rounded-md ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={handleSearch}>
            Go
          </Button>
          <ModalCloseButton className={`${theme === 'dark' ? 'text-white' : 'text-black'} hover:text-blue-700`} />
        </Box>
        <Box width="100%" h="100vh">
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
  );
};

export default SideDrawer;
