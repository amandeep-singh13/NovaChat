import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

// Creating ChatProvider for wrapping the whole app
const ChatProvider = ({ children }) => {
  const navigate = useNavigate(); 

  const [user, setUser] = useState(null);

  useEffect(() => {
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(UserInfo);

    if (!UserInfo) {
      navigate("/"); 
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {  
    return useContext(ChatContext);
};

export default ChatProvider;