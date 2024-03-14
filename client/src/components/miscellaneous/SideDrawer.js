import React, {useState} from 'react';
import axios from "axios";
import {Button} from "@chakra-ui/button";
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
import {useChatState} from "../../Context/ChatProvider"
import {useNavigate} from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
const SideDrawer=()=>{
    const [search,setSearch]=useState("");
        const [searchResult,setseachResult]=useState([]);
        const {isOpen, onOpen, onClose}=useDisclosure();
        const [loading,setLoading]=useState(false);
        const [loadingChat,setLoadingChat]=useState();
        const navigate=useNavigate();

        const { selectedChat, setSelectedChat, chats, setChats } = useChatState();

        const logoutHandler=()=>{
          localStorage.removeItem("userInfo");
          navigate("/");
        };

        const user = JSON.parse(localStorage.getItem("userInfo"));
        const toast=useToast();
        const handleSearch=async()=>{
          if(!search){
            toast({
              title:"Please Enter something in search",
              status:"warning",
              duration:5000,
              isClosable:true,
              position:"top-left",
            });
            return;
          }

      try{
        setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };
        const {data}=await axios.get(`/api/user/register?search=${search}`,config);
        setLoading(false);
        setseachResult(data);
          }
          catch(error){
            toast({
              title:"Error occured!",
              description:"Search failed",
              status:"error",
              duration:5000,
              isClosable:true,
              position:"bottom left",
            });
          }
        };
        const accessChat=async(userId)=>{
         try{
          setLoadingChat(true)
          const config={
            headers:{
              "Content-type":"application/json",
              Authorization:`Bearer ${user.token}`,
            },
          };
          const {data} =await axios.post('/api/chat',{userId},config);
          if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
          setSelectedChat(data);
          setLoadingChat(false);
          onClose();
         }
         catch(error){
          toast({
            title:"Error fetching the chat",
            description:error.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
          });
         }
        }
        return<>
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
  <Text fontSize= '25px' fontFamily="Work sans" pr= {15}>
    NovaChat
  </Text>
  <div>
    <Menu>
      <MenuButton as={Button} fontSize='18px' bg="white" rightIcon={<ChevronDownIcon />}>
        <Avatar
          size="md"
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


      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
};

export default SideDrawer;