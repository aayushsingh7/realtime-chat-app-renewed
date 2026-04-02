import {useState} from "react";
import MessageBubble from "../components/message/MessageBubble";
import {FiCopy, FiCornerUpRight, FiStar, FiTrash2} from "react-icons/fi";
import type {MenuOption} from "../components/ui/ContextMenu";
import ContextMenu from "../components/ui/ContextMenu";
import { IoCheckboxOutline } from "react-icons/io5";

interface MessageLayoutProps {}

const MessageLayout: React.FC<MessageLayoutProps> = ({}) => {
    const [menuState, setMenuState] = useState({isOpen: false, x: 0, y: 0});

    const menuOptions: MenuOption[] = [
        {text: "Reply", icon: FiCornerUpRight, func: () => console.log("Reply clicked")},
        {text: "Copy Text", icon: FiCopy, func: () => console.log("Copy clicked")},
        {text: "Star", icon: FiStar, func: () => console.log("star clicked")},
        {text: "Select", icon: IoCheckboxOutline, func: () => console.log("select clicked")},
        {text: "Delete", icon: FiTrash2, func: () => console.log("Delete clicked")},
    ];

    const handleRightClick = (e: React.MouseEvent) => {
        console.log("clicked");
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuState({
            isOpen: true,
            x: e.clientX,
            y: rect.bottom + 5,
        });
    };

    return (
        <section
            className="w-full h-full flex-1 overflow-y-auto flex flex-col flex-1"
            style={{
                backgroundImage: "url(./default-chat-bg.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <ContextMenu
                isOpen={menuState.isOpen}
                x={menuState.x}
                y={menuState.y}
                options={menuOptions}
                onClose={() => setMenuState((prev) => ({...prev, isOpen: false}))}
            />
            <MessageBubble text="Hello" sender={false} onRightClick={handleRightClick} />
            <MessageBubble text="How are you doing???" sender={false} onRightClick={handleRightClick} />
            <MessageBubble
                text="Hey! i am fine, its been so long since we last talk"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />
            <MessageBubble
                text="and how are you studies going man???"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />
            <MessageBubble
                text="Heheh! you are right its been ages since we talked"
                sender={false}
                onRightClick={handleRightClick}
            />
            <MessageBubble
                text="My studies are awsome and everything else is also pretty good"
                sender={false}
                onRightClick={handleRightClick}
            />
            <MessageBubble
                text="Thats pretty good huhh"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />{" "}
            <MessageBubble
                text="btw you were studing cs right?"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />{" "}
            <MessageBubble
                text="did you like coding??"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />{" "}
            <MessageBubble
                text="you there???"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />{" "}
            <MessageBubble
                text="???"
                sender={true}
                messageStatus="seen"
                onRightClick={handleRightClick}
            />{" "}
        </section>
    );
};

export default MessageLayout;
