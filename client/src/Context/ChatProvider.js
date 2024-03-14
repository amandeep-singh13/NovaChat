import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

// Creating ChatProvider for wrapping the whole app
const ChatProvider = ({ children }) => { 
  const [selectedChat,setSelectedChat]=useState(null);
  const [notification,setNotification]=useState([]);
  const [chats,setChats]=useState([]);


  return (
    <ChatContext.Provider value={{selectedChat,setSelectedChat,notification,setNotification,chats,setChats}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {  
    return useContext(ChatContext);
};

export default ChatProvider;