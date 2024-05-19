import { FC, useEffect, useRef, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import {
  IoDocumentAttachOutline,
  IoImageOutline
} from "react-icons/io5";
import Button from "../components/Button";
import Input from "../components/Input";
import Preview from "../components/Preview";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import {
  addNewMessage,
  handleIsReplying,
  sendingMessage,
} from "../slice/chatSlice";
import {
  handleDiscardFileUpload,
  handleShowPreview,
  handleShowUploadOption
} from "../slice/utilitySlices";
import styles from "../styles/MessageInput.module.css";
import { MessageType, UserType } from "../types/types";
import generateID from "../utils/generateID";
import ConfirmDialog from "./ConfirmDialog";

interface MessageInputProps {
  socket: any;
  isTyping: boolean;
  setTyping: any;
  typing: boolean;
}

const MessageInput: FC<MessageInputProps> = ({
  socket,
  isTyping,
  setTyping,
  typing,
}) => {
  const { showUploadOptions, showPreview, discardFileUpload } = useCustomSelector(
    (state) => state.utilitySlices
  )
  const { loggedInUser } = useCustomSelector((state) => state.user) as { loggedInUser: UserType };
  const { selectedChat, isReplying, selectedMessage } = useCustomSelector((state) => state.chats)
  const dispatch = useAppDispatch();
  const imageAndVideoRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [textMessage, setTextMessage] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [extensionName, setExtensionName] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [caption, setCaption] = useState<string>("")
  const [file, setFile] = useState<any>(null);
  const messageQueue = useRef<MessageType[]>([]);
  const requestProcessing = useRef<boolean>(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleFileChange = (file: any) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleFileUpload = async (e: any) => {
    setLoadingPreview(true);
    let file = e.target.files[0];
    if (!file) return;
    handleFileChange(file);
    setExtensionName(file.name.substring(file.name.lastIndexOf(".") + 1));
    setFileName(file.name);
    setFileSize(file.size);
    dispatch(handleShowPreview(true));
    dispatch(handleShowUploadOption(false));
    console.log("loading started")
    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const dataURL = e.target.result;
        setFile(dataURL);
        console.log("loading ended")
        setLoadingPreview(false);
        const document_type: string = dataURL.substring(
          dataURL.indexOf(":") + 1,
          dataURL.indexOf(";")
        );
        setFileType(document_type);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const addMessagesToQueue = async (e?: any) => {
    console.log("atleast messages are working")
    if (showPreview && !previewUrl || !showPreview && !textMessage) return
    if (e && e.key === "Enter" || e && e.type === "click") {
      dispatch(handleIsReplying(false));
      const dummyMessage: MessageType = {
        _id: generateID(),
        isReply: isReplying,
        repliedTo: isReplying
          ? {
            _id: selectedMessage._id,
            sender: { name: selectedMessage.sender.name },
            message: selectedMessage.message,
            fileName: selectedMessage.fileName,
            msgType: selectedMessage.msgType,
          }
          : {},
        createdAt: new Date().toISOString(),
        document: selectedFormat === "Document" ? true : false,

        message: previewUrl ? previewUrl : textMessage,
        msgType: fileType ? fileType : "text",
        fileSize: fileSize,
        fileName: fileName,
        seenBy: [{ _id: loggedInUser._id, name: loggedInUser.name }],
        reactEmoji: [],
        starredBy: [],
        caption: caption,
        sender: {
          _id: loggedInUser._id,
          name: loggedInUser.name,
          image: loggedInUser.image,
        },
        status: "sending",
      };

      messageQueue.current = [...messageQueue.current, dummyMessage];
      setTextMessage("");
      dispatch(sendingMessage(dummyMessage));
      dispatch(handleShowPreview(false));
    }

    if (messageQueue.current.length > 0 && !requestProcessing.current) {
      const currentMessage = messageQueue.current[0];
      console.log("2. current message sent to sendNewMessages function()");
      await sendNewMessage(currentMessage);
    }
  };

  const sendNewMessage = async (currentMessage: MessageType) => {
    const requestBody = file
      ? {
        isReply: isReplying,
        repliedTo: selectedMessage._id,
        file: file,
        msgType: currentMessage.msgType,
        chatId: selectedChat._id,
        document: currentMessage.document,
        fileName: fileName,
        fileSize: currentMessage.fileSize,
        caption: caption,
      }
      : {
        isReply: isReplying,
        repliedTo: selectedMessage._id,
        message: currentMessage.message,
        msgType: currentMessage.msgType,
        chatId: selectedChat._id,
        fileName: fileName,
        document: currentMessage.document,
      };
    try {
      requestProcessing.current = true;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/new-message`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      requestProcessing.current = false;
      messageQueue.current = messageQueue.current.filter((msg: MessageType) => {
        return msg._id !== currentMessage._id;
      });
      dispatch(
        addNewMessage({
          newMessage: { ...data.newMessage, status: "sent" },
          dummyMessageId: currentMessage._id,
        })
      );
      addMessagesToQueue();
      socket.emit("new message", data.newMessage, selectedChat);
    } catch (err) {
      dispatch(
        addNewMessage({
          newMessage: { ...currentMessage, status: "error" },
          dummyMessageId: currentMessage._id,
        })
      );
    }
  };

  useEffect(() => {
    if (!showPreview) {
      setFileName("");
      setFile(null);
      setPreviewUrl("");
      setFileType("");
      setFileSize(0);
      setSelectedFormat("");
      setExtensionName("");
    }
  }, [showPreview]);

  let timer: any,
    timeoutVal: number = 500;

  const typingHandler = (e: any) => {
    setTextMessage(e.target.value);
    window.clearTimeout(timer);
    if (e.target.value.trim().length > 0) {
      socket.emit("typing started", loggedInUser, selectedChat);
    }
  };

  function handleKeyUp() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      socket.emit("stop typing", loggedInUser, selectedChat);
    }, timeoutVal);
  }

  return (
    <>
      {discardFileUpload && <ConfirmDialog onCancle={() => dispatch(handleDiscardFileUpload(false))} onConfirm={() => { dispatch(handleShowPreview(false)); dispatch(handleDiscardFileUpload(false)) }} heading="Discard message?" body="Are you sure you want to discard message?" btnText="Discard" btnText2={"Retur to media"} />}
      <div
        style={{
          width: "100%",
          position: "relative",
          zIndex: isReplying ? "20" : "5",
        }}
      >
        {isReplying ? (
          // <div style={{ padding: "0px 20px" }}>

          <div className={styles.reply_msg}>
            <div className={styles.selected_msg_preview}>
              <div className={styles.msg}>
                <p>{selectedMessage.sender.name}</p>
                {selectedMessage.msgType.includes("image") ? (
                  <img src={selectedMessage.message} />
                ) : selectedMessage.msgType.includes("vidoe") ? (
                  <video src={selectedMessage.message}></video>
                ) : selectedMessage.msgType === "text" ? (
                  <span>{selectedMessage.message}</span>
                ) : (
                  <div className={styles.rr}>
                    <FileIcon
                      extension={selectedMessage.fileName?.substring(
                        selectedMessage.fileName.lastIndexOf(".") + 1
                      )}
                      {...defaultStyles[
                      selectedMessage.fileName?.substring(
                        selectedMessage.fileName.lastIndexOf(".") + 1
                      )
                      ]}
                    />
                    <span>{selectedMessage.fileName}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => dispatch(handleIsReplying(false))}
              style={{
                height: "50px",
                background: "var(--light-background)",
                marginLeft: "10px",
                borderRadius: "10px",
                width: "50px",
                flexShrink: "0",
              }}
              children={
                <AiOutlineCloseCircle
                  style={{
                    color: "var(--primary-text-color)",

                    fontSize: "24px",
                  }}
                />
              }
            />
          </div>
        ) : null}
        <div style={{ position: "relative", width: "100%" }}>
          {showPreview ? (
            <Preview
              fileName={fileName}
              fileSize={fileSize}
              func={addMessagesToQueue}
              url={previewUrl}
              type={fileType}
              extension={extensionName}
              setCaption={setCaption}
              loadingPreview={loadingPreview}
              selectedFormat={selectedFormat}
            />
          ) : null}
          {showUploadOptions && (
            <div className={styles.options}>
              <input
                onChange={(e) => {
                  handleFileUpload(e);
                  setSelectedFormat("Photos and videos");
                }}
                type="file"
                accept="image/*,video/*"
                ref={imageAndVideoRef}
                style={{ display: "none" }}
              />

              <input
                onChange={handleFileUpload}
                type="file"
                capture="environment"
                ref={cameraRef}
                style={{ display: "none" }}
              />

              <input
                onChange={(e) => {
                  handleFileUpload(e);
                  setSelectedFormat("Document");
                }}
                onKeyDown={addMessagesToQueue}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.rtf,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,.py, .java, .js, .cpp, .cxx, .cc, .cs, .html, .htm, .css, .rb, .php, .swift, .kt, .ts, .go, .rs, .sh, .pl, .r, .m, .sql, .dart, .scala, .lua, .pl, .sh, .ts, .hs, .m, .lisp, .lsp, .asm, .dart, .groovy, .r, .m, .ps1, .psm1, .erl, .hrl, .jl, .tcl, .tk, .f, .f90, .f95, .cob, .cbl, .swift, .tsx, .jsx, .json"
                ref={documentRef}
                style={{ display: "none" }}
              />

              <Button
                onClick={() => imageAndVideoRef.current && imageAndVideoRef.current.click()}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  flexShrink: "0",
                }}
                children={
                  <>
                    <IoImageOutline
                      style={{
                        color: "var(--primary-text-color)",
                        padding: "7px",
                        fontSize: "35px",
                      }}
                    />
                    <p>Photos and Videos</p>
                  </>
                }
              />



              <Button
                onClick={() => documentRef.current && documentRef.current.click()}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  flexShrink: "0",
                }}
                children={
                  <>
                    <IoDocumentAttachOutline
                      style={{
                        color: "var(--primary-text-color)",
                        padding: "7px",
                        fontSize: "33px",
                      }}
                    />
                    <p>Documents</p>
                  </>
                }
              />
            </div>
          )}

          <div
            className={styles.container}
          >

            {showPreview && <div className={styles.custom_shadow} onClick={() => dispatch(handleDiscardFileUpload(true))}></div>}
            <Button
              onClick={() => dispatch(handleShowUploadOption(!showUploadOptions))}
              style={{
                width: "50px",
                height: "45px",
                background: "var(--light-background)",
                marginRight: "10px",
                borderRadius: "10px",
                flexShrink: "0",
              }}
              children={
                <GrAttachment
                  style={{
                    color: "var(--primary-text-color)",
                    padding: "7px",
                    fontSize: "38px",
                  }}
                />
              }
            />

            <Input
              onKeyUp={handleKeyUp}
              value={textMessage}
              onKeyDown={addMessagesToQueue}
              onChange={typingHandler}
              style={{
                background: "var(--light-background)",
                padding: "12px",
                borderRadius: "10px",
                width: "100%",
                fontSize: "17px",
              }}
              placeholder="Type a message..."
            />
            <Button
              onClick={addMessagesToQueue}
              style={{
                width: "50px",
                height: "45px",
                background: !textMessage ? "var(--light-background)" : "var(--highlight-background)",
                marginLeft: "10px",
                borderRadius: "10px",
                flexShrink: "0",
              }}
              children={
                <IoIosSend
                  style={{
                    color: "var(--primary-text-color)",
                    padding: "7px",
                    fontSize: "38px",
                  }}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
