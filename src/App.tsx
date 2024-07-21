import { FC, useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useCustomSelector } from "./hooks/useCustomSelector";
import Chats from "./layouts/Chats";
import CreateGroup from "./layouts/CreateGroup";
import SideNavbar from "./layouts/SideNavbar";
import Verify from "./layouts/Verify";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ConfirmDialog from "./layouts/ConfirmDialog";
import Error from "./layouts/Error";
import LoadingTask from "./layouts/LoadingTask";
import ViewFile from "./layouts/ViewFile";
import NotFound from "./pages/NotFound";
import {
  addChat,
  addNewMessage,
  addUserInGroup,
  blockUser,
  changeTheme,
  deleteForEveryone,
  leaveGroup,
  messageSeen,
  promoteAdmin,
  reactOnMessage,
  removeFromAdmin,
  removeReactionFromMessage,
  removeUserFromGroup,
  unBlockUser,
  updateChats,
} from "./slice/chatSlice";
import {
  handleAskPermission,
  handleDiscardFileUpload,
  handleShowAdminOptions,
  handleShowProfile,
  handleShowSettings,
  handleShowUploadOption,
  setIsError
} from "./slice/utilitySlices";
import "./styles/global.css";
import { ChatType, MessageType, Notification_Settings, UserType } from "./types/types";
import sendNotification from "./utils/sendNotification";
import ProtectedRoute from "./utils/ProtectedRoute";

interface AppProps { }

const App: FC<AppProps> = () => {
  const { selectedChat, createGroup, isReplying } = useCustomSelector((state) => state.chats);
  const [socketConnected, setSocketConnection] = useState<boolean>(false);
  const { loggedInUser } = useCustomSelector((state) => state.user)

  const dispatch = useAppDispatch();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!loggedInUser._id) return;
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: loggedInUser._id
      }
    });

    socketRef.current.on("connect", () => {
      setSocketConnection(true);
    });
    socketRef.current.emit("setup", loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    if (!socketRef.current) return;
    const notification_settings: Notification_Settings = JSON.parse(localStorage.getItem("notification_settings") || '{}')
    const newMessageHandler = (newMessage: MessageType, chat: ChatType) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(addNewMessage({ newMessage: newMessage }));
      } else {
        dispatch(updateChats({ newMessage: newMessage, chatId: chat._id }));
        if (notification_settings.messages_notifications) {
          sendNotification("New Message!", `${newMessage.sender.name}: ${newMessage.msgType !== "text" ? newMessage.fileName : newMessage.message}`, `new message id: ${newMessage._id}`, `https://chatverse-chat.netlify.app/chat/${chat._id}`)
        }

      }
    };

    const reactOnMessages = (
      user: UserType,
      message: MessageType,
      emoji: string,
      chat: ChatType
    ) => {

      if (chat && chat._id === selectedChat._id) {
        dispatch(
          reactOnMessage({
            messageId: message._id,
            reaction: emoji,
            user: user,
          })
        );
      } else {
        if (message.sender._id === loggedInUser._id && user._id !== loggedInUser._id && notification_settings.react_on_message_notifications) {
          sendNotification("Reacted on message", `${user.name} reacted "${emoji}" on your message`, `reaction ${message._id}`, `https://chatverse-chat.netlify.app/chat/${chat._id}`)
        }
      }
    };

    const removeReaction = (
      userId: string,
      messageId: string,
      emoji: string,
      chat: ChatType
    ) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(
          removeReactionFromMessage({
            messageId: messageId,
            reaction: emoji,
            userId: userId,
          })
        );
      }
    }

    const deleteMessage = (
      userId: string,
      messageIds: string,
      chat: ChatType
    ) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(
          deleteForEveryone({
            messageIds: messageIds,
          })
        );
      }
    };

    const createNewChat = (newChat: ChatType) => {
      dispatch(addChat({ chat: newChat }));
    };

    const addUser = (userData: UserType, newChat: ChatType, chat: ChatType) => {
      window.alert("new user added")
      if (chat && chat._id === selectedChat._id) {
        dispatch(addUserInGroup({ newUser: userData }));
      }
      if (userData._id === loggedInUser._id) {
        dispatch(addChat({ chat: newChat }))
      }
    };

    const removeUser = (userData: UserType, chat: ChatType, method: string) => {
      window.alert("group leave")
      if (chat && chat._id === selectedChat._id) {
        if (method === "left") {
          dispatch(leaveGroup({ userId: userData._id }))
        } else {
          dispatch(removeUserFromGroup({ newUser: userData }));
        }
      }
    };

    const promoteAdminFunc = (
      promoterUserId: string,
      promotedUserId: string,
      chat: ChatType
    ) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(promoteAdmin({ userId: promotedUserId }));
      }
    };

    const removeFromAdminFunc = (
      removerUserId: string,
      removedUserId: string,
      chat: ChatType
    ) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(removeFromAdmin({ userId: removedUserId }));
      }
    };

    // user are getting their own id's in seen
    const messageSeenFunc = (messageIds: string[], chat: ChatType, user: UserType) => {
      if (chat && chat._id === selectedChat._id) {

        dispatch(
          messageSeen({
            messageIds,
            user: user,
            chatId: chat._id
          })
        );
      }
    };

    const changeThemeFunc = async (
      theme: any,
      chat: ChatType,
      alertMessage: MessageType,
    ) => {
      if (chat && chat._id === selectedChat._id) {
        dispatch(
          changeTheme(theme)
        );
        if (chat && chat._id === selectedChat._id) {
          dispatch(addNewMessage({ newMessage: alertMessage }));
        } else {
          dispatch(updateChats({ newMessage: alertMessage, chatId: chat._id }));
        }
      }
    };

    const blockUserFunc = (userId: string, blockedUserId: string) => {
      dispatch(blockUser({ userId, blockedUserId }))
    }

    const unBlockUserFunc = (userId: string, blockedUserId: string) => {
      dispatch(unBlockUser({ userId, blockedUserId }))
    }

    socketRef.current.on("create new chat triggered", createNewChat);
    socketRef.current.on("new message received", newMessageHandler);
    socketRef.current.on("react on message received", reactOnMessages);
    socketRef.current.on("delete message triggered", deleteMessage);
    socketRef.current.on("user joined", addUser);
    socketRef.current.on("user removed", removeUser);
    socketRef.current.on("promoted to admin", promoteAdminFunc);
    socketRef.current.on("removed from admin", removeFromAdminFunc);
    socketRef.current.on("message seen received", messageSeenFunc);
    socketRef.current.on("theme changed", changeThemeFunc);
    socketRef.current.on("remove reaction", removeReaction)
    socketRef.current.on("user blocked", blockUserFunc)
    socketRef.current.on("user unBlocked", unBlockUserFunc)




    return () => {
      socketRef.current.off("new message received", newMessageHandler);
      socketRef.current.off("react on message received", reactOnMessages);
      socketRef.current.off("delete message triggered", deleteMessage);
      socketRef.current.off("create new chat triggered", createNewChat);
      socketRef.current.off("user joined", addUser);
      socketRef.current.off("user removed", removeUser);
      socketRef.current.off("promoted to admin", promoteAdminFunc);
      socketRef.current.off("removed from admin", removeFromAdminFunc);
      socketRef.current.off("message seen received", messageSeenFunc);
      socketRef.current.off("theme changed", changeThemeFunc);
      socketRef.current.off("remove reaction", removeReaction)
      socketRef.current.off("user blocked", blockUserFunc)
      socketRef.current.off("user unBlocked", unBlockUserFunc)
    };
  }, [dispatch, selectedChat?._id, socketRef.current, selectedChat?.messages]);

  const { verify, showUploadOptions, showPreview, showProfile, showSettings, isError, askPermission, showLoading, viewFile } =
    useCustomSelector((state) => state.utilitySlices);

  useEffect(() => {
    dispatch(setIsError(false))
  }, [])

  const allowNotification = () => {
    Notification.requestPermission().then((permission: string) => {
      if (permission === "granted") {
        localStorage.setItem("isNotificationPermitted", JSON.stringify(true))
        localStorage.setItem("notification_permission_asked_on", JSON.stringify(new Date().toISOString()))
        localStorage.setItem("notification_settings", JSON.stringify({ text_preview: true, messages_notifications: true, react_on_message_notifications: true, calls_notifications: true, media_preview: true }))
      } else {
        localStorage.setItem("isNotificationPermitted", JSON.stringify(false))
        localStorage.setItem("notification_permission_asked_on", JSON.stringify(new Date().toISOString()))
        localStorage.setItem("notification_settings", JSON.stringify({ text_preview: false, messages_notifications: false, react_on_message_notifications: false, calls_notifications: false, media_preview: false }))
      }
    })
  }



  useEffect(() => {
    if (showLoading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [showLoading])

  return (
    <div className="app_container default">
      {showLoading && <LoadingTask />}
      {viewFile && <ViewFile />}
      {verify && <Verify />}
      {isError && <Error />}
      {askPermission &&
        <ConfirmDialog
          btnText="Allow notification"
          heading="Allow notifications?"
          body="Please presss 'allow' to get notifications and stay updated"
          onCancle={() => { dispatch(handleAskPermission(false)); allowNotification() }}
          onConfirm={() => { dispatch(handleAskPermission(false)); allowNotification() }} />}
      <div className="app">
        {showUploadOptions ||
          showPreview ||
          showProfile ||
          showSettings ||
          isReplying ||
          createGroup ? (
          <div
            className={`shadow ${showPreview || showSettings || isReplying
              ? "darker flex"
              : showProfile || createGroup
                ? "darker-fast flex"
                : "transparent"
              }`}
            onClick={() => {
              dispatch(handleShowSettings(false));
              dispatch(handleShowUploadOption(false));
              dispatch(handleShowProfile(false));
              dispatch(handleShowAdminOptions(false));
              showPreview && dispatch(handleDiscardFileUpload(true))
            }}
          >
            {createGroup && <CreateGroup socket={socketRef.current} />}

          </div>
        ) : null}

        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <SideNavbar />
                <Chats socket={socketRef.current} />
                <Home />
              </ProtectedRoute>
            }
            path="/"
          />
          <Route
            element={
              <ProtectedRoute>
                <SideNavbar />
                <Chats socket={socketRef.current} />
                <Chat
                  socket={socketRef.current}
                  socketConnected={socketConnected}
                />

              </ProtectedRoute>
            }
            path="/chat/:id"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ProtectedRoute><SideNavbar /><Chats socket={socketRef.current} /> <NotFound /></ProtectedRoute>} path="*" />
        </Routes>
      </div>
    </div >
  );
};

export default App;
