import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Message from "../components/Message";
import MessageOptions from "../components/MessageOptions";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import ChatNavbar from "../layouts/ChatNavbar";
import MessageInput from "../layouts/MessageInput";
import Profile from "../layouts/Profile";
import { fetchMessages, handleFetchChat, handleIsMoreMessages, setMoreMessages } from "../slice/chatSlice";
import { ChatType, MessageType, UserType } from "../types/types";
import chatInfo from "../utils/chatInfo";
import messageSeenFunc from "../utils/messageSeenFunc";
import { setIsError } from "../slice/utilitySlices";

interface MessagesProps {
  socket: any;
}

const Messages: FC<MessagesProps> = ({ socket }) => {
  const messageRef = useRef(null);
  const offset = useRef<number>(25);
  const loadingRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<UserType>()
  const [isTyping, setIsTyping] = useState(false);
  const [isInView, setIsInView] = useState<boolean>(false)
  const loadingMoreMessages = useRef<boolean>(false)
  const lastMessageRef = useRef(null)
  const [selectedMessages, setSelectedMessages] = useState<MessageType[]>([]);

  const {
    selectedChat,
    messagesLoading,
    selectMessagesOption,
    showMessageOptions,
    isMoreMessages,
    fetchChat,
  }: {
    selectedChat: ChatType;
    messagesLoading: boolean;
    selectMessagesOption: boolean;
    showMessageOptions: boolean;
    isMoreMessages: boolean;
    fetchChat: boolean,
  } = useCustomSelector((state) => state.chats);

  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );

  const { showProfile } = useCustomSelector((state) => state.utilitySlices);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id === "new-chat") return;
    if (!fetchChat) {
      dispatch(handleFetchChat(true))
      return
    }

    dispatch(fetchMessages(id));
  }, [id]);


  useEffect(() => {
    if (isInView || !messageRef.current) return;
    //@ts-ignore
    messageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [selectedChat.messages && selectedChat.messages.length]);

  useEffect(() => {
    if (selectedChat._id && selectedChat.messages.length > 0) {
      const unSeenMessagesID = selectedChat.messages
        .filter(message => !message.seenBy.some(user => user._id === loggedInUser._id))
        .map(message => message._id);

      if (unSeenMessagesID.length > 0) {
        socket.emit("message seen", unSeenMessagesID, selectedChat, loggedInUser);
        messageSeenFunc(unSeenMessagesID);
      }
    }
  }, [selectedChat, loggedInUser, socket, messageSeenFunc]);


  useEffect(() => {
    messageRef.current.scrollIntoView({
      behavior: "instant",
      block: "end",
      inline: "nearest",
    });
  }, [messagesLoading]);

  const handleMessageSelect = (
    message: MessageType,
    isMessageSelected: boolean
  ) => {

    if (isMessageSelected) {
      setSelectedMessages((oldMsg) => {
        return oldMsg.filter((msg: MessageType) => msg._id !== message._id);
      });
    } else {
      setSelectedMessages((oldMsg) => {
        return [...oldMsg, message];
      });
    }
  };

  useEffect(() => {

    if (!selectMessagesOption && !showMessageOptions) {
      setSelectedMessages([]);
    }
  }, [selectMessagesOption, showMessageOptions]);

  useEffect(() => {
    socket.on("typing", (typingUser: UserType, chat: ChatType) => {

      if (chat && chat._id === selectedChat._id) {
        setTypingUser(typingUser)
        setIsTyping(true);
      }
    });
    socket.on("typing stopped", (typingUser: UserType, chat: ChatType) => {

      if (chat && chat._id === selectedChat._id) {
        setTypingUser({})
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("typing stopped");
    };
  }, [selectedChat]);


  const isUserBlockedByLoggedInUser = useMemo(() => selectedChat._id && selectedChat.users?.find((user: UserType) => user._id === loggedInUser._id)?.blockedUsers?.includes(chatInfo(selectedChat, loggedInUser)._id), [selectedChat.users])

  const isLoggedInUserBlocked = useMemo(() => selectedChat._id && selectedChat.users?.find((user: UserType) => user._id === chatInfo(selectedChat, loggedInUser)._id)?.blockedUsers?.includes(loggedInUser._id), [selectedChat.users])


  useEffect(() => {
    if (!loadingRef.current || loadingMoreMessages.current) return
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(loadingRef.current);
  }, [selectedChat]);



  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        if (loadingMoreMessages.current) return
        loadMoreMessages()
        setIsInView(true)
      } else {
        setIsInView(false)
      }
    });
  };

  const loadMoreMessages = async () => {
    loadingMoreMessages.current = true
    const lastMessageId = selectedChat.messages[0]._id
    try {
      const chatId = id
      const response = await fetch(`${import.meta.env.VITE_API_URL}/more-messages?offset=${offset.current}&&chatId=${chatId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      dispatch(handleIsMoreMessages(data.isMore))
      loadingMoreMessages.current = false
      if (data.messages.length == 0) return;
      //@ts-ignore
      lastMessageRef.current = document.getElementById(lastMessageId)
      dispatch(setMoreMessages({ chatId: chatId, messages: data.messages }))
      offset.current = offset.current + 25;
    } catch (err) {
      dispatch(setIsError(true))
    }
  }

  useEffect(() => {
    if (!lastMessageRef.current) return;
    //@ts-ignore
    lastMessageRef.current.scrollIntoView({ behavior: "instant", block: "start", inline: "center" })
  }, [offset.current])



  return (
    <>
      {showMessageOptions && <MessageOptions socket={socket} />}
      <div
        className="container"
        style={{
          backgroundImage: `url(${selectedChat.theme?.URL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          flexDirection: "column",
        }}
      >
        {selectedChat._id ? (
          //@ts-ignore
          <ChatNavbar typingUser={typingUser} selectedMessages={selectedMessages} socket={socket} isTyping={isTyping} />
        ) : null}
        <div className="messages">
          {!messagesLoading && isMoreMessages && (
            <div className="flex" style={{ padding: "20px", marginBottom: "20px" }} ref={loadingRef}>

              <div className="loader" ref={loadingRef}></div>
            </div>
          )}
          {messagesLoading ? (
            <div
              style={{ width: "100%", height: "100%" }}
              className="loading_messages"
            >
              <div className="loader"></div>
            </div>
          ) : selectedChat?.messages.length > 0 ? (
            selectedChat?.messages?.map((message) => (
              <Message
                selectMessagesOption={selectMessagesOption}
                key={message._id}
                data={message}
                func={handleMessageSelect}
                selectedMessages={selectedMessages}
              />
            ))
          ) : <div className="beginners-tag flex"><p>Prioritizing your safety: Remember to be cautious when chatting with unfamiliar faces</p></div>}



          <span className="seen_indicator" ref={messageRef}>

          </span>
        </div>
        {selectedChat._id ? (
          isUserBlockedByLoggedInUser ?
            <Button style={{ width: "100%", padding: "16px", color: "var(--secondary-text-color)", background: "var(--primary-background)", fontSize: "0.8rem" }} children={`You have blocked ${chatInfo(selectedChat, loggedInUser).name}, unblock to continue chatting.`} /> :
            isLoggedInUserBlocked ?
              <Button style={{ width: "100%", padding: "16px", color: "var(--secondary-text-color)", background: "var(--primary-background)", fontSize: "0.8rem" }} children="You can no longer be able to send messages in this chat" />
              : selectedChat.removedUsers?.map((user: any) => user._id).includes(loggedInUser._id) ? <Button style={{ width: "100%", padding: "16px", color: "var(--secondary-text-color)", background: "var(--primary-background)", fontSize: "0.8rem" }} children="You can't sent messages to this group because you're no longer a member." /> :
                <MessageInput
                  socket={socket}
                  setTyping={setTyping}
                  typing={typing}
                  isTyping={isTyping}
                />
        ) : null}
      </div>
      {showProfile && <Profile socket={socket} />}
    </>
  );
};

export default Messages;
