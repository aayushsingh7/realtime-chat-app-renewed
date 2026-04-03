import React, { useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FiMic, FiPlus, FiSmile } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAttachmentPanelOpen, setReplyMode } from "../../store/slices/uiSlice";
import Button from "../ui/Button";

interface MessageInputProps {
    onSendMessage?: (message: string) => void;
    onAttachClick?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({onSendMessage, onAttachClick}) => {
    const dispatch = useAppDispatch();
    const {isReplyMode} = useAppSelector((state) => state.ui);

    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        adjustTextareaHeight();
    };

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage?.(message);
            setMessage("");
            dispatch(setReplyMode(false));
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    return (
        <div
            className="absolute bottom-4 left-6 right-6 bg-zinc-900 rounded-[32px] z-20 px-3"
            style={{paddingTop: isReplyMode ? "12px" : "0px"}}
        >
            {isReplyMode && (
                <div className="border-l-5 border-violet-500 p-3 bg-zinc-800 rounded-[20px] relative pl-5 pr-5 flex items-center justify-between">
                    <div className="">
                        <h3 className="text-md font-medium text-violet-500">John Doe</h3>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint expedita perferendis
                            obcaecati. Beatae animi nisi totam quis, mollitia vero eaque djfkaldkf adkfa dfjklj.
                        </p>
                    </div>
                    <Button
                        variant="icon"
                        iconSize={24}
                        onClick={() => dispatch(setReplyMode(false))}
                        Icon={IoMdClose}
                    />
                </div>
            )}
            <div className="flex items-end w-full py-2 shadow-2xl">
                <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                        variant="icon"
                        onClick={() => dispatch(setAttachmentPanelOpen(true))}
                        Icon={FiPlus}
                        title="Attach file"
                        iconSize={24}
                        className="p-3"
                    />
                    <Button variant="icon" Icon={FiSmile} title="Emoji" iconSize={24} className="p-3" />
                </div>

                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Write a message..."
                    className="flex-1  bg-transparent text-zinc-100 text-[17px] pl-3 pr-4 py-[10px] overflow-y-auto resize-none focus:outline-none placeholder-zinc-400 scrollbar-thin scrollbar-thumb-zinc-600"
                    style={{minHeight: "45px"}}
                />

                <div className="flex-shrink-0 ml-1">
                    {message.trim().length > 0 ? (
                        <Button
                            variant="icon"
                            Icon={BsFillSendFill}
                            title="Attach file"
                            iconSize={22}
                            className="p-3 bg-violet-600 hover:bg-violet-500"
                            iconClassName="text-white"
                        />
                    ) : (
                        <Button variant="icon" Icon={FiMic} title="Voice message" iconSize={24} className="p-3" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
