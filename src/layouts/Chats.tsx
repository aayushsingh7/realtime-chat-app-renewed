import { FC, useEffect, useRef, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline, IoCheckbox, IoCheckboxOutline, IoCreateOutline, IoSettingsOutline } from "react-icons/io5";
import { LuCircleDashed } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { PiDogThin, PiShootingStarLight } from "react-icons/pi";
import { RiMenuSearchLine } from "react-icons/ri";
import { TbStarOff } from "react-icons/tb";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import Input from "../components/Input";
import Loader from "../components/Loader";
import MessageBox from "../components/MessageBox";
import UserBox from "../components/UserBox";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import { fetchStarredMessages, handleCreateGroup, handleIsMoreChats, handleShowStarredMessages, setMoreLoadedChats } from "../slice/chatSlice";
import { handleLogout } from "../slice/userSlice";
import { handleShowSettings, setIsError } from "../slice/utilitySlices";
import styles from "../styles/Chats.module.css";
import { ChatType, MessageType, UserType } from "../types/types";
import searchUsers from "../utils/searchUsers";
import starredMessagesFunc from "../utils/starredMessages";
import ConfirmDialog from "./ConfirmDialog";
import Settings from "./Settings";

interface ChatsProps {
  socket: any;
}

const Chats: FC<ChatsProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const { loggedInUser }: { loggedInUser: UserType } = useCustomSelector(
    (state) => state.user
  );
  const { showChats, isMoreChats } = useCustomSelector((state) => state.chats
  )
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<MessageType[]>([])
  const { id } = useParams()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const offset = useRef<number>(15)
  const loadingMoreChats = useRef<boolean>(false)
  const loadingRef = useRef<any>(null)
  const [selectMessageOption, setIsSelctMessageOption
  ] = useState<boolean>(false)

  const handleMessageSelect = (message: MessageType, isSelected: boolean) => {
    if (isSelected) {
      setSelectedMessages((old) => {
        return old.filter((msg: MessageType) => msg._id !== message._id);
      });
    } else {
      setSelectedMessages((old) => {
        return [...old, message];
      });
    }
  };


  const [loading, setLoading] = useState<boolean>(false);
  const {
    chats,
    showStarredMessages,
    starredMessages,
    chatsLoading,
  }: {
    chats: ChatType[];
    chatsLoading: boolean;
    showStarredMessages: boolean;
    starredMessages: MessageType[];
  } = useCustomSelector((state) => state.chats);
  const { showSettings } = useCustomSelector((state) => state.utilitySlices);

  useEffect(() => {
    if (showStarredMessages) {
      dispatch(fetchStarredMessages());
      setIsSelctMessageOption(false)
      setSelectedMessages([])
    }
    setSearchQuery('')
    setSearchResults([])
  }, [showStarredMessages]);


  useEffect(() => {
    if (!loadingRef.current || loadingMoreChats.current || showStarredMessages || searchQuery) return
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(loadingRef.current);
  }, [chatsLoading, showStarredMessages, searchQuery]);



  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        if (loadingMoreChats.current) return
        loadingMoreChatsFunc()
      }
    });
  };

  const loadingMoreChatsFunc = async () => {
    try {
      loadingMoreChats.current = true
      const response = await fetch(`${import.meta.env.VITE_API_URL}/load-more-chats?offset=${offset.current}&&userId=${loggedInUser._id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      loadingMoreChats.current = false
      if (data.chats.length == 0) return;
      dispatch(handleIsMoreChats(data.isMore))

      dispatch(setMoreLoadedChats(data.chats))
      offset.current = offset.current + 15;
    } catch (err) {
      dispatch(setIsError(true))
    }
  }


  return (
    <>
      {confirmDelete && <ConfirmDialog heading="Remove starred message(s)?" body="Are you sure you want to remove these messages from starred messages?" btnText="Confirm" onCancle={() => { setConfirmDelete(false); setSelectedMessages([]); setIsSelctMessageOption(false) }}
        onConfirm={() => {
          starredMessagesFunc(
            selectedMessages.map((msg: MessageType) => msg._id),
            loggedInUser._id,
            "",
            dispatch,
            true); setConfirmDelete(false); setIsSelctMessageOption(false); setSelectedMessages([]);
        }} />}
      <div className={`${styles.container} ${showChats && !id ? styles.show : styles.hide}`}>
        {showSettings && <Settings />}
        <div
          style={{
            width: "100%",
            padding: "0px 10px 20px 10px",
          }}
        >
          <div className={styles.header}>
            <h1 className={styles.heading}>
              {showStarredMessages ? "Starred Messages" : "ChatVerse"}
            </h1>
            <div className="flex ffff">
              {showStarredMessages && <>
                {selectMessageOption ?
                  <IoCheckbox onClick={() => { setIsSelctMessageOption(false); setSelectedMessages([]) }} /> :
                  <IoCheckboxOutline onClick={() => setIsSelctMessageOption(true)} />}
                {selectMessageOption && <TbStarOff onClick={() => setConfirmDelete(true)} style={{ fontSize: "26px", marginLeft: "15px" }} />}
              </>}
              {!showStarredMessages && <IoCreateOutline style={{ fontSize: "29px" }} onClick={() => dispatch(handleCreateGroup(true))} />}
            </div>
          </div>
          <Input
            onInput={(e: any) => {
              setSearchQuery(e.target.value);
              searchUsers(
                setSearchResults,
                setLoading,
                e.target.value,
                showStarredMessages
              )
            }}
            value={searchQuery}
            style={{
              padding: "15px 20px",
              background: "var(--light-background)",
              width: "100%",
              fontSize: "17px",
              borderRadius: "5px",
              borderBottom: "3px solid var(--highlight-text-color)"
            }}
            placeholder={showStarredMessages ? "Search starred messages" : "Search or start a new chat"}
          />
        </div>
        <div className={styles.box_container}>
          {loading || chatsLoading ? (
            <Loader />
          ) : searchQuery.length > 0 ? (
            searchResults.length == 0 ?
              showStarredMessages ? (
                <div className="flex" style={{ width: "100%", height: "80%", flexDirection: "column", userSelect: "none" }}>
                  <PiShootingStarLight style={{ color: "var(--secondary-text-color)", fontSize: "9rem" }} />
                  <p style={{ fontSize: "0.9rem", color: "var(--secondary-text-color)", marginTop: "20px" }}>No Starred Message(s)</p>
                </div>
              ) :
                (
                  <div className="flex" style={{ width: "100%", height: "80%", flexDirection: "column", userSelect: "none" }}>
                    <PiDogThin style={{ color: "var(--secondary-text-color)", fontSize: "6rem" }} />
                    <p style={{ fontSize: "0.9rem", color: "var(--secondary-text-color)", marginTop: "10px" }}>No User Found</p>
                  </div>
                )
              : searchResults.map((data: any) => {
                return showStarredMessages ? (
                  <MessageBox message={data} key={data._id} selectMessage={handleMessageSelect} selectMessageOption={selectMessageOption} selectedMessages={selectedMessages} />
                ) : (
                  //@ts-ignore
                  <UserBox
                    isReaction={false}
                    isAdminTagNeeded={false}
                    getChat={true}
                    socket={socket}
                    key={data._id}
                    user={data}
                    setSearchQuery={setSearchQuery}
                    setSelectedUser={null}
                  />
                );
              })
          ) : showStarredMessages ? (
            starredMessages.length > 0 ? (
              starredMessages.map((message: MessageType) => {
                return <MessageBox key={message._id} message={message} selectMessage={handleMessageSelect} selectMessageOption={selectMessageOption} selectedMessages={selectedMessages} />;
              })
            ) : (
              <div className="flex" style={{ width: "100%", height: "80%", flexDirection: "column", userSelect: "none" }}>
                <PiShootingStarLight style={{ color: "var(--secondary-text-color)", fontSize: "9rem" }} />
                <p style={{ fontSize: "0.9rem", color: "var(--secondary-text-color)", marginTop: "20px" }}>No Starred Message(s)</p>
              </div>
            )
          ) : chats.length > 0 ? (
            chats.filter((chat) => chat.messages.length > 0)
              .map((chat) => {
                return <ChatBox socket={socket} key={chat._id} chat={chat} />;
              })
          ) : (
            <div className="flex" style={{ width: "100%", height: "80%", flexDirection: "column", userSelect: "none" }}>
              <RiMenuSearchLine style={{ color: "var(--highlight-text-color)", fontSize: "6rem" }} />
              <p className={styles.intro} style={{ fontSize: "0.9rem", color: "var(--secondary-text-color)", marginTop: "20px" }}>
                Search users and start chatting!
                <span>Search "a" to view all users</span>
              </p>
            </div>
          )}


          {!chatsLoading && isMoreChats && !loading && !showStarredMessages && !searchQuery ?
            <div className="flex" style={{ padding: "20px", marginBottom: "20px", width: "100%" }} ref={loadingRef}>
              <div className="loader" ref={loadingRef}></div>
            </div> : null}

        </div>


        <div className={styles.bottom_navbar}>

          <IoChatbubbleEllipsesOutline className={styles.active} onClick={() => dispatch(handleShowStarredMessages(false))} />
          <LuCircleDashed />
          <FaRegStar onClick={() => dispatch(handleShowStarredMessages(true))} />
          <IoSettingsOutline onClick={() => dispatch(handleShowSettings(true))} />
          <MdLogout onClick={() => dispatch(handleLogout(true))} />
        </div>



      </div>
    </>
  );
};

export default Chats;
