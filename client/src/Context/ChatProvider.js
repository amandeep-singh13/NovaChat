import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();

// Creating ChatProvider for wrapping the whole app
const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  //
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  //redirect to home page if not logged in
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      setUser(null);
      navigate('/');
    }
    else{
      setUser(JSON.parse(localStorage.getItem("userInfo")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ChatContext.Provider value={{
      selectedChat, 
      setSelectedChat,
      user,
      setUser, 
      notification, 
      setNotification, 
      chats, 
      setChats
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;