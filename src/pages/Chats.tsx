import ChatLayout from "../layouts/ChatLayout";
import ChatSidebar from "../components/chat/ChatSidebar";
import CreateGroupPanel from "../components/chat/CreateGroupSidebar";

const Chats = ()=> {
    return (
        <div className="w-full h-screen flex">
            <div className="w-[700px]">
                <ChatSidebar/>
                {/* <CreateGroupPanel /> */}
            </div>
            <ChatLayout />
        </div>
    );
}

export default Chats;