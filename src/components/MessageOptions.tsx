import { FC, useMemo, useState } from "react";
import { AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai";
import { BsCopy, BsStar, BsStarFill } from "react-icons/bs";
import { GrCheckboxSelected } from "react-icons/gr";
import { IoAddCircle } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import emojis from "../json/emoji.json";
import ConfirmDialog from "../layouts/ConfirmDialog";
import {
  handleIsReplying,
  handleShowMessageOption,
  setSelectMessagesOption
} from "../slice/chatSlice";
import { handleViewReaction } from "../slice/utilitySlices";
import styles from "../styles/MessgeOptions.module.css";
import { ChatType, MessageType, ReactMessageType, StarredMessageType, UserType } from "../types/types";
import copyToClipboard from "../utils/copyToClipboard";
import deleteMessage from "../utils/deleteMessage";
import formatDate from "../utils/formatDate";
import starredMessagesFunc from "../utils/starredMessages";
import Button from "./Button";
import UserBox from "./UserBox";

interface MessageOptionsProps {
  socket: any;
}

const MessageOptions: FC<MessageOptionsProps> = ({ socket }) => {
  const {
    selectedMessage,
    selectedChat,
    showMessageOptions
  }: { selectedMessage: MessageType; selectedChat: ChatType, showMessageOptions: boolean } =
    useCustomSelector((state) => state.chats);
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const viewReactions = useCustomSelector((state) => state.utilitySlices.viewReactions)
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const closeAll = () => {
    dispatch(handleViewReaction(false))
    dispatch(handleShowMessageOption(false));
    setShowEmojis(false);
  };

  const isAlreadyStarred = useMemo(() => selectedMessage.starredBy.map((u: StarredMessageType) => u.userId).includes(loggedInUser._id), [showMessageOptions])

  const isAlreadyReacted = useMemo(() => selectedMessage.reactEmoji?.find((react: ReactMessageType) => react.user._id === loggedInUser._id), [showMessageOptions])


  const recommendedEmoji = ["😂", "😍", "👍", "🔥", "💀", "👏"];

  const reactOnMessageFunc = async (emoji: string, removeReaction: boolean) => {
    socket.emit(
      removeReaction ? "remove reaction on message" : "react on message",
      { _id: loggedInUser._id, image: loggedInUser.image, name: loggedInUser.name, email: loggedInUser.email },
      selectedMessage,
      emoji,
      selectedChat
    )
    const response = await fetch(`${import.meta.env.VITE_API_URL}/${isAlreadyReacted ? "remove-reaction" : "add-reaction"}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUser._id, messageId: selectedMessage._id, emoji: emoji })
    })
  }


  return (
    <div className={styles.shadow} onClick={closeAll}  >
      {isConfirmed && <ConfirmDialog
        heading="Delete Message?"
        body="Are u sure u want to delete this message"
        btnText="Delete message" onConfirm={() => deleteMessage(
          loggedInUser._id,
          [selectedMessage._id],
          selectedChat,
          socket
        )} onCancle={() => console.log("cancle")} />}

      {!isConfirmed && <div
        className={styles.container}
        style={{ overflowY: showEmojis ? "scroll" : "hidden", maxWidth: viewReactions ? "370px" : "320px" }}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(handleShowMessageOption(false));
        }}
      >
        {viewReactions ?
          <div className={styles.reactions_container} onClick={() => dispatch(handleViewReaction(false))}>
            <h2>Reactions</h2>
            <div className={styles.reactions}>
              {selectedMessage.reactEmoji?.map((react: ReactMessageType) => {
                return <div className={styles.reaction_box}>
                  <UserBox
                    isAdminTagNeeded={false}
                    removeReaction={() => reactOnMessageFunc(react.emoji, isAlreadyReacted && isAlreadyReacted.emoji === react.emoji ? true : false)} isReaction={react.user._id === loggedInUser._id} user={react.user} getChat={false} socket={"none"} key={react.user._id} /> <p className={styles.reaction_emoji}>{react.emoji}</p></div>
              })}
            </div>
          </div> :
          <>
            {showEmojis ? (
              <div className={styles.emoji_grid}>
                {emojis.map((emoji) => {
                  return (
                    <span
                      onClick={() => {
                        closeAll();
                        reactOnMessageFunc(emoji, isAlreadyReacted && isAlreadyReacted.emoji === emoji ? true : false)
                      }}
                      style={isAlreadyReacted && isAlreadyReacted.emoji === emoji ? { background: "var(--lighter-background)", transform: "scale(1.1)" } : {}}
                      key={emoji}
                    >
                      {emoji}
                    </span>
                  );
                })}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => dispatch(handleIsReplying(true))}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      <LuReply style={{ marginRight: "15px", fontSize: "20px" }} />
                      <span>Reply</span>
                    </>
                  }
                />
                <Button
                  onClick={() => copyToClipboard(formatDate([selectedMessage]))}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      <BsCopy style={{ marginRight: "15px", fontSize: "18px" }} />
                      <span>Copy</span>
                    </>
                  }
                />

                <Button
                  onClick={() => {
                    starredMessagesFunc(
                      [selectedMessage._id],
                      loggedInUser._id,
                      selectedChat._id,
                      dispatch,
                      isAlreadyStarred ? true : false
                    );
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      {isAlreadyStarred ? <BsStarFill style={{ marginRight: "15px", fontSize: "20px" }} /> : <BsStar style={{ marginRight: "15px", fontSize: "20px" }} />}
                      <span>{isAlreadyStarred ? "UnStarred" : "Star message"}</span>
                    </>
                  }
                />




                {selectedMessage.sender._id === loggedInUser._id && <Button
                  onClick={(e) => { e.stopPropagation(); setIsConfirmed(true) }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      <AiOutlineDelete
                        style={{ marginRight: "15px", fontSize: "20px" }}
                      />
                      <span>Delete Message</span>
                    </>
                  }
                />}

                <Button
                  onClick={() => {
                    dispatch(setSelectMessagesOption(true));
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      <GrCheckboxSelected
                        style={{ marginRight: "18px", fontSize: "18px" }}
                      />
                      <span>Select</span>
                    </>
                  }
                />



                <Button
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--primary-background)",
                    justifyContent: "flex-start",
                  }}
                  children={
                    <>
                      <AiOutlineInfoCircle
                        style={{ marginRight: "18px", fontSize: "23px" }}
                      />
                      <span>Info</span>
                    </>
                  }
                />
              </>
            )}
            {!showEmojis && (
              <div className={styles.reaction}>
                {recommendedEmoji.map((emoji) => {
                  return (
                    <span
                      onClick={() =>
                        reactOnMessageFunc(emoji, isAlreadyReacted && isAlreadyReacted.emoji === emoji ? true : false)
                      }
                      style={isAlreadyReacted && isAlreadyReacted.emoji === emoji ? { background: "var(--lighter-background)", transform: "scale(1.1)" } : {}}
                      key={emoji}
                    >
                      {emoji}
                    </span>
                  );
                })}

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmojis(true);
                  }}
                >
                  <IoAddCircle />
                </span>
              </div>
            )}
          </>}
      </div>}
    </div >
  );
};

export default MessageOptions;
