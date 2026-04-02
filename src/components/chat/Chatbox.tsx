import React from "react";
import {RiCheckDoubleFill, RiCheckFill} from "react-icons/ri";

interface ChatBoxProps {
    profileImage?: string;
    userName?: string;
    latestMessage?: string;
    unreadCount?: number;
    messageStatus?: "sent" | "delivered" | "seen" | "none";
    sentAt?: string;
    isOnline?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
    profileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    userName = "John Doe",
    latestMessage = "Hey, how are you doing today?",
    unreadCount = 3,
    messageStatus = "seen",
    sentAt = "2:45 PM",
    isOnline = true,
}) => {
    const getStatusIcon = () => {
        switch (messageStatus) {
            case "sent":
                return <RiCheckFill className="h-5 w-5 text-zinc-400" />;
            case "delivered":
                return <RiCheckDoubleFill className="h-5 w-5 text-zinc-400" />;
            case "seen":
                return <RiCheckDoubleFill className="h-5 w-5 text-violet-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-colors duration-150 ease-in-out select-none flex items-center gap-3">
            <div className="relative flex-shrink-0">
                <img src={profileImage} alt={userName} className="w-12 h-12 rounded-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline justify-between mb-0.5">
                    <h3 className="font-medium text-white text-[15px] truncate pr-2">{userName}</h3>
                    <span className="text-xs text-zinc-400 flex-shrink-0 whitespace-nowrap">{sentAt}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                        <div className="flex-shrink-0">{getStatusIcon()}</div>
                        <p className="text-[14px] text-zinc-400 truncate">{latestMessage}</p>
                    </div>

                    {unreadCount > 0 && (
                        <div className="flex-shrink-0 bg-violet-500 text-white rounded-full w-[25px] h-[20px] shrink-0 flex justify-center text-[14px] font-medium">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
