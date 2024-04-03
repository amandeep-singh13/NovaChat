import React, { useContext } from "react";
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { ThemeContext } from '../Context/ThemeContext';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const { theme } = useContext(ThemeContext);

  return (
    <Box
      className="rounded-xl"
      style={{ backgroundColor: theme === "dark" ? "black" : "white", color: theme === "dark" ? "white" : "black" }}
      w="69%"
      h="100vh"
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={5}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
