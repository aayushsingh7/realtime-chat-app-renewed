import AttachmentPanel from "../components/message/AttachmentPanel";
import ChatInfoBar from "../components/chat/ChatInfoBar";
import ChatNavbar from "../components/chat/ChatNavbar";
import MessageInput from "../components/message/MessageInput";
import MessagesPanel from "./MessageLayout";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import { setAttachmentPanelOpen, setChatInfoOpen } from "../store/slices/uiSlice";

const ChatLayout = () => {
    const dispatch = useAppDispatch();
    const {isChatInfoOpen, isAttachmentPanelOpen, isSelectionMode} = useAppSelector((state) => state.ui);

    return (
        <section className="w-full h-full bg-zinc-900 flex items-start justify-center flex-col">
            <div className="flex w-full h-full relative">
                <div className="w-full flex-1 h-full flex flex-col relative">
                    <ChatNavbar />
                    <div className="relative flex flex-col w-full flex-1 min-h-0">
                        {isAttachmentPanelOpen && (
                            <AttachmentPanel
                                onClose={() => dispatch(setAttachmentPanelOpen(false))}
                                onSend={() => console.log("onSend()")}
                            />
                        )}
                        <MessagesPanel />
                        {!isSelectionMode && <MessageInput />}
                    </div>
                </div>
                {isChatInfoOpen && <ChatInfoBar isGroupChat={false} onClose={() => dispatch(setChatInfoOpen(false))} />}
            </div>
        </section>
    );
};

export default ChatLayout;
