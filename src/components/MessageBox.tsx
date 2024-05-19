import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { AiOutlineFileImage } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import { handleMessagesLoading } from "../slice/chatSlice";
import styles from "../styles/MessageBox.module.css";
import { MessageType, UserType } from "../types/types";
import chatInfo from "../utils/chatInfo";
import formatTime from "../utils/formatTime";
import scrollToMessage from "../utils/scrollToMessage";

interface MessageBoxProps {
  message: MessageType;
  selectMessage: any;
  selectMessageOption: boolean;
  selectedMessages: MessageType[]
}

const MessageBox: FC<MessageBoxProps> = ({ message, selectMessage, selectMessageOption, selectedMessages }) => {
  // const message = useMemo(()=> message.)
  const navigate = useNavigate()
  const isClicked = useRef<boolean>(false)
  const dispatch = useAppDispatch()
  const { messagesLoading } = useCustomSelector((state) => state.chats)
  const [messageSelected, setMessageSelected] = useState<boolean>(false)
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const time = useMemo(() => message.createdAt && formatTime(message.createdAt), []);
  const { id } = useParams()

  const handleClick = () => {
    if (selectMessageOption) {
      selectMessage(message, messageSelected)
      return;
    }
    isClicked.current = true;
    scrollToMessage(message._id, styles.selected)
    if (id === "inbox" || id !== message.chat?._id) {
      dispatch(handleMessagesLoading(true))
      navigate(`/chat/${message.chat?._id}`)
    }
  }



  useEffect(() => {
    if (!messagesLoading && isClicked.current) {
      scrollToMessage(message._id, styles.selected)
      isClicked.current = false
    }
  }, [messagesLoading])


  const isSelected = selectedMessages.map((m: MessageType) => m._id).includes(message._id)



  return (
    <div className={`${styles.selected_message_box} ${isSelected && styles.selected} ${selectMessageOption ? styles.select_on : styles.select_off}`} style={{ padding: selectMessageOption ? "0px 10px" : "0px" }}>
      {
        selectMessageOption && <div
          className={`${styles.checkbox} ${isSelected ? styles.checked : styles.unchecked
            }`}
        >
          {isSelected && <FaCheck />}
        </div>

      }
      <div
        className={styles.container}

        onClick={() => { handleClick(); setMessageSelected(!messageSelected) }}
      >
        <div className={styles.chat_details}>
          <p className={styles.user_name}>{message.chat && chatInfo(message?.chat, loggedInUser).name}
            <span >
              {time}
            </span></p>
          <p className={styles.latest_message}>
            {
              //@ts-expect-error messgae.sender contains only id and not the whole sender data
              message.sender === loggedInUser._id ? <>You: </> : null}


            <span>
              {message.msgType.includes("image") ||
                message.msgType.includes("video") ? (
                <span style={{ display: "flex", alignItems: "center", marginLeft: "3px" }}>
                  <AiOutlineFileImage style={{ marginRight: "5px" }} />{" "}
                  {message.fileName}
                </span>
              ) : message.document ? (
                <span style={{ display: "flex", alignItems: "center", marginLeft: "3px" }}>
                  <IoDocumentText style={{ marginRight: "5px" }} />{" "}
                  {message.fileName}
                </span>
              ) : (
                message.message
              )}
            </span>


          </p>
        </div>
        {
          (message.msgType !== "alert" && message.msgType !== "text") &&
          <div className={styles.message_container}>
            {message.document ?
              <FileIcon
                extension={message.fileName?.substring(message.fileName.lastIndexOf(".") + 1)}
                {...defaultStyles[message.fileName?.substring(message.fileName.lastIndexOf(".") + 1)]}
              />
              : message.msgType.includes("image") ?
                <img src={message.message} alt="" /> :
                message.msgType.includes("video") ?
                  <video src={message.message} ></video> :
                  null}
          </div>

        }
      </div >
    </div>
  );
};

export default MessageBox;
