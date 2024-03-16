import React, {useState} from "react";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";
const ChatPage = () => {
     const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
      {<SideDrawer />}
      <Box className="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && (<MyChats  fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain}/>)}
        { user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>

    );
};

export default ChatPage;