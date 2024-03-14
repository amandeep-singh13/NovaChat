import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
const ChatPage = () => {
    return (
        <div style={{width:"100%"}}>
            <SideDrawer/>
            <div className="flex justify-between size-full p=1">
                <MyChats/>
                <ChatBox/>
            </div>
        </div>
    );
};

export default ChatPage;