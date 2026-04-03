import React, { useState } from "react";
import { FiMeh, FiMenu, FiStar } from "react-icons/fi";
import { MdOutlineGroupAdd, MdOutlineLogout } from "react-icons/md";
import ChatBox from "./Chatbox";
import type { MenuOption } from "../ui/ContextMenu";
import ContextMenu from "../ui/ContextMenu";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { setGroupCreatorOpen, setStarredMessagesOpen } from "../../store/slices/uiSlice";
import { useAppDispatch } from "../../store/hooks";

interface Chat {
    id: string;
    userName: string;
    latestMessage: string;
    unreadCount: number;
    messageStatus: "sent" | "delivered" | "seen" | "none";
    sentAt: string;
    isOnline: boolean;
    profileImage: string;
    isActive?: boolean;
}

const ChatSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const mockChats: Chat[] = [
        {
            id: "1",
            userName: "John Doe",
            latestMessage: "Hey, how are you doing today?",
            unreadCount: 3,
            messageStatus: "seen",
            sentAt: "2:45 PM",
            isOnline: true,
            profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            isActive: true, // Highlights this chat as currently selected
        },
        {
            id: "2",
            userName: "Alice Smith",
            latestMessage: "Can you send over the Figma files?",
            unreadCount: 0,
            messageStatus: "delivered",
            sentAt: "11:20 AM",
            isOnline: false,
            profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        },
        {
            id: "3",
            userName: "Design Team",
            latestMessage: "Mark: The new layouts look great.",
            unreadCount: 12,
            messageStatus: "none",
            sentAt: "Yesterday",
            isOnline: true,
            profileImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
        },
    ];

    const [menuState, setMenuState] = useState({isOpen: false, x: 0, y: 0});

    const menuOptions: MenuOption[] = [
        {text: "New group", icon: MdOutlineGroupAdd, func: () => dispatch(setGroupCreatorOpen(true))},
        {text: "Starred messages", icon: FiStar, func: () => dispatch(setStarredMessagesOpen(true))},
        {text: "Logout", icon: MdOutlineLogout, func: () => console.log("Pin clicked")},
    ];

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect()
        setMenuState({
            isOpen: true,
            x:rect.left,
            y:rect.bottom,
        });
    };

    return (
        <div className="w-full  h-screen flex flex-col bg-[#18181b] border-r-3 border-zinc-800 flex-shrink-0 text-zinc-100">
            <div className="px-4 py-3 flex items-center gap-3">
                <Button onClick={handleRightClick} variant="icon" Icon={FiMenu} iconSize={28} />

                <ContextMenu
                    isOpen={menuState.isOpen}
                    x={menuState.x}
                    y={menuState.y}
                    options={menuOptions}
                    onClose={() => setMenuState((prev) => ({...prev, isOpen: false}))}
                />
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <Input placeholder="Search or start a new chat"/>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                {mockChats.map((chat) => (
                    <div key={chat.id} className={`relative ${chat.isActive ? "bg-[#8774e1]/10" : ""}`}>
                        {/* {chat.isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8774e1] rounded-r-md z-10"></div>
                        )} */}

                        <ChatBox
                            userName={chat.userName}
                            latestMessage={chat.latestMessage}
                            unreadCount={chat.unreadCount}
                            messageStatus={chat.messageStatus}
                            sentAt={chat.sentAt}
                            isOnline={chat.isOnline}
                            profileImage={chat.profileImage}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
