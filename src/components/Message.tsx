import { FC, useMemo, useRef, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { AiFillStar } from "react-icons/ai";
import { BsCheck2All, BsSend } from "react-icons/bs";
import { FaCheck, FaChevronDown, FaRegSmileBeam } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import {
  handleShowMessageOption,
  selectMessage,
  setViewMessage,
} from "../slice/chatSlice";
import { handleViewFile, handleViewReaction } from "../slice/utilitySlices";
import styles from "../styles/Message.module.css";
import { ChatType, MessageType, UserType } from "../types/types";
import donwloadFile from "../utils/donwloadFile";
import formatFileSize from "../utils/formatFileSize";
import formatTime from "../utils/formatTime";
import isNewUserMessage from "../utils/isNewUserMessage";
import scrollToMessage from "../utils/scrollToMessage";
import Button from "./Button";

interface MessageProps {
  data: MessageType;
  func: any;
  selectMessagesOption: boolean;
  selectedMessages: MessageType[];
}

const Message: FC<MessageProps> = ({
  data,
  func,
  selectMessagesOption,
  selectedMessages,
}) => {
  const dispatch = useAppDispatch();
  const componentRef = useRef(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector((state) => state.user);
  const isSender = loggedInUser._id === data.sender._id;
  const { selectedChat }: { selectedChat: ChatType } = useCustomSelector((state) => state.chats);

  const navigateUser = () => {
    if (selectMessagesOption) return;
    if (!data.document && data.msgType !== "text" && data.msgType !== "alert") {
      dispatch(setViewMessage(data));
      dispatch(handleViewFile(true))
    }
  };

  const handleClick = () => {
    if (selectMessagesOption && data.msgType !== "alert") {
      func(data, messageSelected);
    }
  };

  const extension = useMemo(
    () => data.fileName?.substring(data.fileName.lastIndexOf(".") + 1),
    []
  );

  const messageSelected = selectedMessages
    .map((message) => message._id)
    .includes(data._id);

  let everyoneIncluded: boolean = true;
  for (const user of selectedChat.users) {
    if (!data.seenBy.map((u: UserType) => u._id).includes(user._id)) {
      everyoneIncluded = false;
      break;
    }
  }

  return (
    <div
      ref={componentRef}
      id={`${data._id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`${styles.container} ${data.msgType === "alert"
        ? styles.alert
        : isSender
          ? styles.sender
          : styles.receiver
        } ${selectMessagesOption && data.msgType !== "alert"
          ? messageSelected
            ? styles.selected
            : styles.select_msg
          : ""
        }`}
      style={{
        justifyContent: isSender
          ? selectMessagesOption
            ? "space-between"
            : "flex-end"
          : "flex-start",
      }}
    >
      {isHovered && !selectMessagesOption && data.msgType !== "alert"
        ? isSender && (
          <div
            className={styles.message_options}
            onClick={() => {
              dispatch(handleShowMessageOption(true));
              dispatch(selectMessage(data));
              func(data, messageSelected);
            }}
          >
            {" "}
            <FaRegSmileBeam /> <FaChevronDown />
          </div>
        )
        : null}

      {(selectMessagesOption && data.msgType !== "alert") && (
        <div
          className={`${styles.checkbox} ${messageSelected ? styles.checked : styles.unchecked
            }`}
        >
          {messageSelected && <FaCheck />}
        </div>
      )}

      {
        selectedChat.isGroupChat && data.sender._id !== import.meta.env.VITE_MESSAGE_BOT_ID && data.sender._id !== loggedInUser._id ?
          <div className={styles.group_user_pic}>
            {!isNewUserMessage(selectedChat, data) && <img alt="user" src={data.sender.image} />}
          </div> : null
      }

      <div
        className={`${styles.msg_con}  ${data.msgType !== "text"
          ? `${styles.fixed_width}`
          : `${styles.auto_width}`
          }`}
        style={{
          width: data.document ? "330px" : "auto",
          marginBottom: data.reactEmoji && data.reactEmoji?.length > 0 ? "2px" : "0px",
          transform: `translateX(${!data.status || data.status === "sent" ? "0px" : "-20px"
            })`,
        }}
      >



        <div
          className={`${styles.content_container}`}
          style={{
            padding:
              data.msgType.includes("image") || data.msgType.includes("video")
                ? "8px 8px 0px 8px"
                : data.document
                  ? "0px 10px 0px 10px"
                  : "10px 10px 0px 10px",
            marginTop: isNewUserMessage(selectedChat, data) ? "2px" : "7px"
          }}
          onClick={navigateUser}
        >
          {data.isReply ? (
            <div className={styles.reply} style={{ cursor: "pointer" }}>
              <div
                className={styles.replied_to}
                onClick={() => data.repliedTo &&
                  scrollToMessage(data.repliedTo?._id, styles.selected)
                }
              >
                <span style={{ marginBottom: "5px", fontWeight: "600" }}>
                  {data.repliedTo?.sender.name}
                </span>
                <div className={styles.reply_view}>
                  {data.repliedTo?.msgType.includes("image") ? (
                    <img src={data.repliedTo?.message} />
                  ) : data.repliedTo?.msgType.includes("vidoe") ? (
                    <video src={data.repliedTo?.message}></video>
                  ) : data.repliedTo?.msgType === "text" ? (
                    <span>{data.repliedTo?.message}</span>
                  ) : (
                    <FileIcon
                      extension={data.repliedTo?.fileName?.substring(
                        data.repliedTo?.fileName.lastIndexOf(".") + 1
                      )}
                      {...defaultStyles[
                      data.repliedTo?.fileName?.substring(
                        data.repliedTo.fileName?.lastIndexOf(".") + 1
                      )
                      ]}
                    />
                  )}
                  {data.repliedTo?.msgType.includes("image") ||
                    data.repliedTo?.msgType.includes("video") ? null : (
                    <span>{data.repliedTo?.fileName}</span>
                  )}
                </div>
              </div>
              <p className={styles.text_message} style={{ marginTop: "5px" }}>
                {data.message}
              </p>
            </div>
          ) : data.document ? (
            <>
              {data.msgType.includes("pdf") ? (
                <div className={styles.document_preview}>
                  <FileIcon
                    extension={extension}
                    {...defaultStyles[extension]}
                  />
                </div>
              ) : null}
              <div className={styles.document_details}>
                <div className={styles.document_info}>
                  <FileIcon
                    extension={extension}
                    {...defaultStyles[extension]}
                  />
                  <div className={styles.description}>
                    <p>{data.fileName}</p>
                    <span>
                      {formatFileSize(data.fileSize)} |{" "}
                      <span style={{ fontWeight: "500" }}>
                        {extension?.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className={styles.btn_container}>
                  {data.msgType.includes("pdf") && (
                    <a
                      target="_blank"
                      href={data.message}
                      style={{
                        padding: "10px 20px",
                        width: "100%",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        background: "var(--lighter-highlight-background)",
                        marginRight: "10px",
                        borderRadius: "5px",
                      }}
                      children="Open"
                    />
                  )}

                  <Button
                    onClick={() => donwloadFile(data)}
                    download={data.fileName}
                    style={{
                      padding: "10px 20px",
                      width: "100%",
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      background: "var(--lighter-highlight-background)",
                      borderRadius: "5px",
                    }}
                    children="Donwload"
                  />
                </div>
              </div>
            </>
          ) : data.msgType.includes("image") ? (
            <img loading="eager" src={data.message} alt={data.fileName} />
          ) : data.msgType.includes("video") ? (
            <video src={data.message}></video>
          ) : (
            <p className={styles.text_message}>
              {data.moderator && (data.moderator._id === loggedInUser._id ? "You" : data.moderator.name)} {data.message}{" "}
              {data.user && data.user.name}
              {data?.eventPerformed === "promoted to admin" && " to admin"}
              {data?.eventPerformed === "remove from admin" && " from admin"}
            </p>
          )}
          {data.caption && <p className={styles.text_message}>{data.caption}</p>}
          {data.msgType !== "alert" && (
            <span className={styles.timestamp}>
              {data.createdAt && formatTime(data.createdAt)}
              {data.starredBy
                ?.map((d) => d.userId)
                .includes(loggedInUser._id) ? (
                <AiFillStar />
              ) : null}
              {data.status === "sending" ? null : data.sender._id === loggedInUser._id ? everyoneIncluded ? <BsCheck2All style={{ color: "var(--seen-message-color)", fontSize: "16px", marginLeft: "5px" }} /> :
                <BsCheck2All style={{ fontSize: "16px", marginLeft: "5px" }} /> : null}
            </span>
          )}
        </div>

        {data.reactEmoji && data.reactEmoji?.length > 0 ? (
          <span className={styles.react} onClick={() => { dispatch(handleViewReaction(true)); dispatch(selectMessage(data)); dispatch(handleShowMessageOption(true)) }}>{data.reactEmoji?.slice(0, 3).map((react) => react.emoji)} {data.reactEmoji?.length > 1 && `${data.reactEmoji?.length > 9 ? "9+" : data.reactEmoji?.length}`}</span>
        ) : null}
      </div>

      {isHovered && !selectMessagesOption && data.msgType !== "alert"
        ? !isSender && (
          <div
            className={styles.message_options}
            onClick={() => {
              dispatch(handleShowMessageOption(true));
              dispatch(selectMessage(data));
              func(data, messageSelected);
            }}
          >
            {" "}
            <FaChevronDown /> <FaRegSmileBeam />
          </div>
        )
        : null}

      {data.status == "sending" ? <BsSend className={styles.sending} /> : null}
      {data.status == "error" ? <VscError className={styles.error} /> : null}
    </div>
  );
};
export default Message;
