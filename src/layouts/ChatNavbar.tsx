import { FC, useState } from "react";
import { BsArrowLeft, BsCopy, BsStar } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import Button from "../components/Button";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import {
  handleShowChats,
  setSelectedChat,
  setSelectMessagesOption
} from "../slice/chatSlice";
import { handleShowProfile } from "../slice/utilitySlices";
import styles from "../styles/ChatNavbar.module.css";
import { ChatType, MessageType, UserType } from "../types/types";
import chatInfo from "../utils/chatInfo";
import copyToClipboard from "../utils/copyToClipboard";
import deleteMessage from "../utils/deleteMessage";
import formatDate from "../utils/formatDate";
import starredMessages from "../utils/starredMessages";
import ConfirmDialog from "./ConfirmDialog";

interface ChatNavbarProps {
  selectedMessages: MessageType[];
  socket: any;
  isTyping: boolean;
  typingUser: UserType,
}

const ChatNavbar: FC<ChatNavbarProps> = ({ typingUser, isTyping, selectedMessages, socket }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const {
    selectedChat,
    selectMessagesOption
  }: {
    selectedChat: ChatType;
    selectMessagesOption: boolean;
  } = useCustomSelector((state) => state.chats);


  return (
    <div className={styles.container}>

      {isConfirmed && <ConfirmDialog
        heading="Delete Messages?"
        body="Are u sure u want to delete selected messages"
        btnText="Delete messages"
        onConfirm={() => {
          deleteMessage(
            loggedInUser._id,
            selectedMessages.map((msg: MessageType) => msg._id),
            selectedChat,
            socket
          ); dispatch(setSelectMessagesOption(false))
            ; setIsConfirmed(false)
        }} onCancle={() => setIsConfirmed(false)} />}

      <div className={styles.part_one}>
        <BsArrowLeft
          className={styles.exit_chat}
          onClick={() => {
            dispatch(handleShowChats(true))
            navigate("/");
            dispatch(setSelectedChat({}));
          }}
        />
        <div
          className={styles.details}
          onClick={() => dispatch(handleShowProfile(true))}
          style={{ cursor: "pointer" }}
        >
          <div className={styles.pfp}>
            <img
              src={chatInfo(selectedChat, loggedInUser).image}
              alt="Profile pic"
            />
          </div>

          <div className={styles.chat_details}>
            <p>{chatInfo(selectedChat, loggedInUser).name}</p>
            <span className={`${styles.typing_span} ${isTyping ? styles.typing : ""}`}>{isTyping ? selectedChat.isGroupChat ? `${typingUser.name} is typing...` : "Typing..." : selectedChat.isGroupChat ? selectedChat.users.map((user: UserType) => user.name).join(", ") : chatInfo(selectedChat, loggedInUser).email}</span>
          </div>
        </div>
      </div>

      {selectMessagesOption ? (
        <div
          className={styles.part_two}
          onClick={() => dispatch(setSelectMessagesOption(false))}
        >
          <Button
            onClick={() => copyToClipboard(formatDate(selectedMessages))}
            style={{
              padding: "11px",
              background: "var(--primary-background)",
              justifyContent: "flex-start",
              borderRadius: "5px",
              marginRight: "10px",
            }}
            children={<BsCopy style={{ fontSize: "20px" }} />}
          />

          <Button
            onClick={() =>
              starredMessages(
                selectedMessages.map((msg: MessageType) => msg._id),
                loggedInUser._id,
                selectedChat._id,
                dispatch,
                false
              )
            }
            style={{
              padding: "11px",
              background: "var(--primary-background)",
              justifyContent: "flex-start",
              borderRadius: "5px",
              marginRight: "10px",
            }}
            children={<BsStar style={{ fontSize: "20px" }} />}
          />

          <Button
            onClick={(e) => { e.stopPropagation(); setIsConfirmed(true) }}
            style={{
              padding: "11px",
              background: "var(--primary-background)",
              justifyContent: "flex-start",
              borderRadius: "5px",
              marginRight: "10px",
            }}
            children={<AiOutlineDelete style={{ fontSize: "22px" }} />}
          />

          <Button
            style={{
              width: "100px",
              padding: "11px",
              fontSize: "0.75rem",
              background: "var(--light-background)",
              borderRadius: "5px",
            }}
            children={"Cancle"}
          />
        </div>
      ) : (
        <div className={styles.part_two}>
          <div className={styles.more_options}>
            <Button
              style={{ width: "60px", background: "var(--light-background)" }}
              children={
                <FaVideo
                  style={{
                    color: "var(--primary-text-color)",
                    padding: "10px",
                    fontSize: "38px",
                  }}
                />
              }
            />
            <Button
              style={{ width: "60px", background: "var(--light-background)" }}
              children={
                <IoCall
                  style={{
                    color: "var(--primary-text-color)",
                    padding: "10px",
                    fontSize: "38px",
                  }}
                />
              }
            />
          </div>
          <Button
            style={{
              width: "50px",
              background: "var(--light-background)",
              marginLeft: "20px",
              borderRadius: "10px",
            }}
            children={
              <AiOutlineSearch
                style={{
                  color: "var(--primary-text-color)",
                  padding: "7px",
                  fontSize: "38px",
                }}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default ChatNavbar;
