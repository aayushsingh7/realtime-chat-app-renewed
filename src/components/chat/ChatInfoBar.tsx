import React, {useState} from "react";
import {FiX, FiUserPlus, FiBell, FiSearch} from "react-icons/fi";
import UserBox from "../ui/UserBox";
import Input from "../ui/Input";

interface ChatInfoBarInterface {
    isGroupChat: boolean;
    onClose: () => void;
}

const ChatInfoBar: React.FC<ChatInfoBarInterface> = ({isGroupChat = false, onClose}) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState("Media");
    const [searchQuery, setSearchQuery] = useState("");
    const tabs = ["Media", "Files", "Links", "Music", "GIF"];
    const groupMembers: any = [
        {id: 1, name: "Suman 🥰Suman🥰", status: "last seen 1 hour ago", color: "bg-pink-400", initial: "S"},
        {id: 2, name: "Alex Doe", status: "online", color: "bg-blue-500", initial: "A"},
        {id: 3, name: "Sarah Smith", status: "last seen recently", color: "bg-emerald-500", initial: "S"},
        {id: 4, name: "John Dev", status: "last seen yesterday", color: "bg-orange-400", initial: "J"},
    ];

    const filteredMembers = groupMembers.filter((member: any) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[380px] h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans border-l border-zinc-800">
            <div className="flex items-center justify-between p-4 pb-6">
                <button
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <FiX className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold tracking-wide">{isGroupChat ? "Group Info" : "User Info"}</h2>
                <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors">
                    <FiUserPlus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col items-center pb-6">
                <div className="w-[120px] h-[120px] rounded-full bg-violet-500 flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-lg relative">
                    {isGroupChat ? "G" : "J"}
                </div>
                <h3 className="text-xl font-semibold mb-1">{isGroupChat ? "Friends Group 🚀" : "John Doe"}</h3>
                <p className="text-zinc-400 text-sm">{isGroupChat ? "4 members" : "last seen 1 hour ago"}</p>
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-zinc-100">
                    <FiBell className="w-5 h-5" />
                    <span className="text-[15px] font-medium">Notifications</span>
                </div>
                <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                        notificationsEnabled ? "bg-[#7e57c2]" : "bg-zinc-600"
                    }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                            notificationsEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                </button>
            </div>

            {!isGroupChat ? (
                <div className="flex flex-col flex-1 overflow-hidden mt-2">
                    <div className="flex border-b border-zinc-800 px-2 overflow-x-auto scrollbar-none">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-fit px-4 py-3 text-sm font-medium transition-colors relative ${
                                    activeTab === tab ? "text-[#9575cd]" : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500 rounded-t-md" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-zinc-500 text-[15px]">No media files yet</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1 overflow-hidden mt-2 border-t border-zinc-800">
                    <div className="p-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <Input placeholder="Search members" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member: any) => <UserBox member={member} />)
                        ) : (
                            <p className="text-center text-zinc-500 text-sm mt-4">No members found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInfoBar;
