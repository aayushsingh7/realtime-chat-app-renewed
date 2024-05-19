import { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineClockCircle, AiOutlineFileImage } from "react-icons/ai";
import { BsCheck2All } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import {
  handleFetchChat,
  handleMessagesLoading,
  handleShowChats,
  setSelectedChat,
  setSelectMessagesOption,
} from "../slice/chatSlice";
import styles from "../styles/ChatBox.module.css";
import { ChatType, MessageType, UserType } from "../types/types";
import chatInfo from "../utils/chatInfo";
import formatTime from "../utils/formatTime";

interface ChatBoxProps {
  chat: ChatType;
  socket: any;
}

const ChatBox: FC<ChatBoxProps> = ({ chat, socket }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [typingUser, setTypingUser] = useState<UserType>()

  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const { selectedChat }: { selectedChat: ChatType } = useCustomSelector(
    (state) => state.chats
  );

  const handleClick = () => {
    dispatch(handleShowChats(false))
    if (selectedChat._id !== chat._id) {
      dispatch(handleFetchChat(true))
      dispatch(setSelectMessagesOption(false));
      dispatch(setSelectedChat(chat));
      dispatch(handleMessagesLoading(true));
    }
  };

  const unReadMessage: number = useMemo(
    () =>
      //@ts-ignore
      chatInfo(chat, loggedInUser).messages.reduce((total, message) => {
        if (
          //@ts-ignore
          !message.seenBy.map((user) => user._id).includes(loggedInUser._id)
        ) {
          return total + 1;
        } else {
          return total;
        }
      }, 0),
    [chat.messages]
  );

  const latestMessage: MessageType = useMemo(
    () => chat.latestMessage,
    [chat.latestMessage, chat.messages]
  );

  useEffect(() => {
    socket.on("typing", (typingUser: UserType, c: ChatType) => {
      if (c && c._id === chat._id) {
    setTypingUser(typingUser)
    setIsTyping(true);
  }
    });
socket.on("typing stopped", (typingUser: UserType, c: ChatType) => {
  if (c && c._id === chat._id) {
    //@ts-ignore
    setTypingUser({})
    setIsTyping(false);
  }
});

return () => {
  socket.off("typing");
  socket.off("typing stopped");
};
  }, [id]);

let everyoneIncluded: boolean = true;
for (const user of chat.users) {
  if (!chat.latestMessage?.seenBy?.map((u: UserType) => u._id).includes(user._id)) {
    everyoneIncluded = false;
    break;
  }
}


return (
  <Link
    className={styles.container}
    onClick={handleClick}
    to={`/chat/${chat._id}`}
    style={{
      background:
        chat._id === id
          ? "var(--light-background)"
          : "var(--primary-background)",
    }}
  >
    <div className={styles.pfp} style={{ background: "var(--light-background)" }}>
      <img src={chatInfo(chat, loggedInUser).image} alt="profile pic" />
    </div>
    <div className={styles.details}>
      <p className={styles.user_name}>
        {chat._id && chatInfo(chat, loggedInUser).name}{" "}
        <span>{formatTime(chat.updatedAt)}</span>
      </p>
      {isTyping ? <p style={{ color: "var(--highlight-text-color)", fontSize: "0.74rem", fontWeight: "500", marginTop: "4px" }}>{selectedChat.isGroupChat ? `${typingUser && typingUser.name} is typing...` : 'Typing...'}</p> : <p className={styles.latest_message}>
        {latestMessage && latestMessage._id ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            {latestMessage?.sender?._id === loggedInUser._id || chat.isGroupChat ? (
              <span style={{ marginRight: "4px", marginTop: "0px" }}>
                {latestMessage?.sender?._id === loggedInUser._id ? "You:" : chat.isGroupChat && latestMessage.sender._id !== import.meta.env.VITE_MESSAGE_BOT_ID ? latestMessage?.sender.name + ":" : null}
              </span>
            ) : null}
            {chat.messages[chat.messages.length - 1]?.status === "sending" ? (
              <AiOutlineClockCircle style={{ marginRight: "5px" }} />
            ) : chat.latestMessage.sender?._id === loggedInUser?._id ? everyoneIncluded ? <BsCheck2All style={{ color: "var(--seen-message-color)", fontSize: "19px", flexShrink: "0", marginRight: "2px" }} /> :
              <BsCheck2All style={{ fontSize: "19px", flexShrink: "0", marginRight: "2px" }} /> : null}
            <span className={styles.latest_message_ab}>
              {latestMessage?.moderator?._id ? (
                <>
                  {
                    <>
                      {latestMessage?.moderator._id === loggedInUser._id
                        ? "You "
                        : latestMessage?.moderator.name}{" "}
                      {latestMessage?.message} {latestMessage?.user?.name}
                    </>
                  }
                </>
              ) : latestMessage?.msgType.includes("image") ||
                latestMessage?.msgType.includes("video") ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <AiOutlineFileImage style={{ marginRight: "5px" }} />{" "}
                  Image
                </span>
              ) : latestMessage?.document ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <IoDocumentText style={{ marginRight: "5px" }} />{" "}
                  Video
                </span>
              ) : (
                latestMessage?.message
              )}
            </span>
          </span>
        ) : null}
        {latestMessage &&
          (unReadMessage > 0 ? (
            <span className={styles.latest_message_counter}>
              {unReadMessage > 99 ? "99+" : unReadMessage}
            </span>
          ) : null)}
      </p>}
    </div>
  </Link>
);
};

export default ChatBox;
