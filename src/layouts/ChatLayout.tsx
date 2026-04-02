import AttachmentPanel from "../components/message/AttachmentPanel";
import ChatInfoBar from "../components/chat/ChatInfoBar";
import ChatNavbar from "../components/chat/ChatNavbar";
import CreateGroupPanel from "../components/chat/CreateGroupSidebar";
import MessageInput from "../components/message/MessageInput";
import MessagesPanel from "./MessageLayout";

const ChatLayout = () => {
    return (
        <section className="w-full h-full bg-zinc-900 flex items-start justify-center flex-col">
            <div className="flex w-full h-full relative">
                <div className="w-full flex-1 h-full flex flex-col relative">
                    <ChatNavbar />        
                    <div className="relative flex flex-col w-full h-full">
                        {/* <AttachmentPanel
                            onClose={() => console.log("onClose()")}
                            onSend={() => console.log("onSend()")}
                        /> */}
                        <MessagesPanel />
                        <MessageInput />
                    </div>
                </div>
                {/* <ChatInfoBar isGroupChat={false} onClose={() => console.log("hi")} /> */}
            </div>
        </section>
    );
};

export default ChatLayout;
