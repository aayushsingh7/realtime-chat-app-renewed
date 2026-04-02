import React, {useState} from "react";
import {FaRegStar} from "react-icons/fa";
import {IoMdClose, IoMdMore} from "react-icons/io";
import {MdDeleteOutline} from "react-icons/md";
import Button from "../ui/Button";
import { IoAirplaneOutline } from "react-icons/io5";
import { HiOutlineSearch } from "react-icons/hi";
import { RiMore2Fill } from "react-icons/ri";

interface ChatNavbarProps {
    userName?: string;
    status?: string;
    avatarUrl?: string;
    onCallClick?: () => void;
    onSearchClick?: () => void;
    onOptionsClick?: () => void;
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({
    userName = "John Doe",
    status = "online",
    avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    onCallClick,
    onSearchClick,
    onOptionsClick,
}) => {
    const [editable, setEditable] = useState<boolean>(false);

    return (
        <div className="h-[70px] w-full px-4 bg-zinc-900 border-b-3 border-zinc-800 flex items-center justify-between flex-shrink-0 select-none">
            {editable ? (
                <>
                    <div className="flex items-center justify-center">
                        <button className="mr-5 p-2 hover:bg-zinc-800 hover:text-zinc-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700">
                            <IoMdClose className="text-2xl text-zinc-400" />
                        </button>

                        <h3 className="text-md text-white font-medium">3 Message(s) Selected</h3>
                    </div>

                    <div className="flex items-center justify-center gap-[15px]">
                        <button className="p-2 hover:bg-zinc-800 hover:text-zinc-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700">
                            <FaRegStar className="text-xl text-zinc-400" />
                        </button>
                        <button className="p-2 hover:bg-zinc-800 hover:text-zinc-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700">
                            <MdDeleteOutline className="text-2xl text-zinc-400" />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-3 cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                        <button className="sm:hidden text-zinc-400 hover:text-zinc-100 transition-colors mr-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <div className="relative">
                            <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h2 className="font-medium text-[15px] text-zinc-100 leading-tight mb-0.5">{userName}</h2>

                            <span
                                className={`text-[13px] leading-tight ${
                                    status.toLowerCase() === "online" ? "text-[#8774e1]" : "text-zinc-500"
                                }`}
                            >
                                {status}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <Button variant="icon" Icon={HiOutlineSearch} iconSize={20} />
                        <Button variant="icon" Icon={RiMore2Fill} iconSize={20} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatNavbar;
