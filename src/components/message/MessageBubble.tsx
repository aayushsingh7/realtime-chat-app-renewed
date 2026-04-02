import {RiCheckDoubleFill, RiCheckFill} from "react-icons/ri";
import Checkbox from "../ui/Checkbox";
import {useState} from "react";
import {IoIosArrowDown} from "react-icons/io";

interface MessageBubbleProps {
    text: string;
    sender: boolean;
    onRightClick: (e: React.MouseEvent) => void;
    messageStatus?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({text, sender, onRightClick, messageStatus}) => {
    const [selected, setSelected] = useState<boolean>(false);
    const getStatusIcon = () => {
        switch (messageStatus) {
            case "sent":
                return <RiCheckFill className="h-5 w-5 text-gray-400 ml-1" />;
            case "delivered":
                return <RiCheckDoubleFill className="h-5 w-5 text-gray-400 ml-1" />;
            case "seen":
                return <RiCheckDoubleFill className="h-5 w-5 text-violet-500 ml-1" />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`px-4 w-full flex items-center p-0.5 ${sender ? "justify-end" : "justify-start"} ${
                selected && "bg-violet-900/20"
            }`}
        >
            {/* {!sender && <Checkbox checked={selected} onChange={() => setSelected(!selected)}  />} */}

            <div
                className={`overflow-hidden group mx-2 relative flex space-between px-4 py-3 items-end ${
                    sender ? "bg-purple-950 text-white" : "bg-zinc-900 text-zinc-200"
                } rounded-[10px] max-w-[80%] text-md`}
                onContextMenu={onRightClick}
            >
                {text}
                <span
                    className={`flex items-center justify-center relative ml-2 top-[5px] ${
                        sender ? "text-gray-400" : "text-zinc-400"
                    } text-[13px] font-medium whitespace-nowrap`}
                >
                    7:04 AM
                    {messageStatus && getStatusIcon()}
                </span>

                <span
                    onClick={onRightClick}
                    className="cursor-pointer absolute top-1 right-[-20px] transition-all duration-300 ease-in-out focus:right-[15px] group-hover:right-[15px] group-hover:delay-[400ms]"
                >
                    <IoIosArrowDown className="text-lg text-zinc-400 font-bold" />
                </span>
            </div>

            {/* {sender && <Checkbox checked={selected} onChange={() => setSelected(!selected)} />} */}
        </div>
    );
};

export default MessageBubble;
