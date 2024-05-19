import { FC, useMemo, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { RiUserSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import MediaAndFiles from "../components/MediaAndFiles";
import ProfileDetails from "../components/ProfileDetails";
import UserBox from "../components/UserBox";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCustomSelector } from "../hooks/useCustomSelector";
import { addNewMessage } from "../slice/chatSlice";
import { handleLoading, handleShowAdminOptions, handleShowProfile, setIsError } from "../slice/utilitySlices";
import styles from "../styles/Profile.module.css";
import { ChatType, UserType } from "../types/types";
import alertMessageFunc from "../utils/alertMessageFunc";
import changeChatTheme from "../utils/changeChatTheme";
import chatInfo from "../utils/chatInfo";
import loadChat from "../utils/loadChat";
import searchUsers from "../utils/searchUsers";
import ConfirmDialog from "./ConfirmDialog";

interface ProfileProps {
  socket: any;
}

const Profile: FC<ProfileProps> = ({ socket }) => {
  const user: UserType = useCustomSelector((state) => state.user.loggedInUser);
  const { showAdminOptions } = useCustomSelector(
    (state) => state.utilitySlices
  );
  const inputRef = useRef<any>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType>({ _id: "", name: "", image: "" })
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [confirmLeaveGroup, setConfirmLeaveGroup] = useState<boolean>(false)
  const navigate = useNavigate()
  const selectedChat: ChatType = useCustomSelector(
    (state) => state.chats.selectedChat
  );
  const isUserBlocked = useMemo(() => selectedChat.users.find((u: UserType) => u._id === user._id)?.blockedUsers?.includes(chatInfo(selectedChat, user)._id), [selectedChat.users])
  const dispatch = useAppDispatch();

  const themes = [
    {
      URL: "https://i.pinimg.com/736x/ba/c8/15/bac815fbeff16270f635ad30c00d71f6.jpg",
      name: "default",
    },
    {
      URL: "https://res.cloudinary.com/dvk80x6fi/image/upload/v1715375592/pattern-with-cute-panda-bears-random-oriented-vector-27509923_ruj1n2.jpg",
      name: "panda",
    },
    {
      URL: "https://w0.peakpx.com/wallpaper/382/238/HD-wallpaper-random-abstract-shape-cube-triangle-creative-pattern.jpg",
      name: "pattern_one",
    },
    {
      URL: "https://wallpapers.com/images/hd/cute-pattern-iphone-wl5gljeo7uc6c4iw.jpg",
      name: "pattern_two",
    },
    {
      URL: "https://cdn.wallpapersafari.com/34/35/nUjHfD.jpg",
      name: "pattern_three",
    },
    {
      URL: "https://wallpapers.com/images/hd/dark-space-wallpaper-wyofj4xvqyfz8eg4.jpg",
      name: "pattern_four",
    },
  ];

  const addUser = async (newUser: UserType) => {
    dispatch(handleLoading(true))
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group-chat/add-user`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newUserId: newUser._id,
            chatId: selectedChat._id,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        const alertMessage = await alertMessageFunc(
          selectedChat._id,
          "added",
          user,
          newUser,
          "user added"
        );
        socket.emit("new message", alertMessage, selectedChat);
        socket.emit("add user", newUser, data.newChat, selectedChat);
      }
    } catch (err) {
      dispatch(setIsError(true));
    }
    dispatch(handleLoading(false))
  };

  const removeUser = async (method: string) => {
    setConfirmLeaveGroup(false)
    dispatch(handleLoading(true))
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group-chat/remove-user`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newUserId: method === "left" ? user._id : selectedUser._id,
            chatId: selectedChat._id,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        const alertMessage = await alertMessageFunc(
          selectedChat._id,
          method === "left" ? "left" : "removed",
          user,
          method === "left" ? null : selectedUser,
          method === "left" ? "user left" : "user removed"
        );
        socket.emit("new message", alertMessage, selectedChat);
        socket.emit("remove user", method === "left" ? user : selectedUser, selectedChat, method);
        setSelectedUser({});
      }
    } catch (err) {
      dispatch(setIsError(true));
    }
    dispatch(handleLoading(false))
  };

  const promoteOrDemoteAdmin = async (method: string) => {
    dispatch(handleLoading(true))
    const url =
      method === "promote"
        ? "/group-chat/promote-admin"
        : "/group-chat/demote-admin";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: selectedUser._id,
          chatId: selectedChat._id,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        const alertMessage = await alertMessageFunc(
          selectedChat._id,
          method === "promote" ? "promoted" : "removed",
          user,
          selectedUser,
          method === "promote" ? "promoted to admin" : "removed from admin"
        );
        socket.emit("new message", alertMessage, selectedChat);

        socket.emit(
          method === "promote" ? "promote to admin" : "remove from admin",
          user._id,
          selectedUser._id,
          selectedChat
        );

      }
    } catch (err) {
      dispatch(setIsError(true));
    }
    dispatch(handleLoading(false))
  };
  const isGroupChat = useMemo(() => selectedChat.isGroupChat, [selectedChat]);

  const uploadCustomTheme = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      changeTheme(null, selectedChat, e.target.result)
    };

    reader.readAsDataURL(file);
  }

  const changeTheme = async (themeDetails: any, chat: ChatType, file: any) => {
    dispatch(handleLoading(true))
    try {
      const theme: any = await changeChatTheme(themeDetails, chat, file)
      const alertMessage: any = await alertMessageFunc(
        selectedChat._id,
        "changed chat theme",
        user,
        null,
        "chat theme changed"
      );
      socket.emit("change theme", theme, selectedChat, alertMessage)
    } catch (err) {
      dispatch(setIsError(true))
    }
    dispatch(handleLoading(false))
    dispatch(handleShowProfile(false))
  }

  const blockAndUnblockUser = async (method: string) => {
    dispatch(handleLoading(true))
    try {
      const chat: ChatType = selectedChat;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${method === "block" ? "block-user" : "unblock-user"}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blockUserId: chatInfo(selectedChat, user)._id }) })

      const alertMessage: any = await alertMessageFunc(
        selectedChat._id,
        method !== "block" ? "unBlocked" : "blocked",
        user,
        //@ts-ignore
        chatInfo(selectedChat, user),
        method !== "block" ? "unBlocked" : "blocked",
      );
      dispatch(addNewMessage({ newMessage: alertMessage }));
      socket.emit(isUserBlocked ? "unBlock user" : "block user", user._id, chatInfo(chat, user)._id, chat)
    } catch (err) {
      dispatch(setIsError(true))
    }
    dispatch(handleLoading(false))
    dispatch(handleShowProfile(false))
  }

  return (
    <>
      {confirmLeaveGroup && <ConfirmDialog heading="Leave group?" body={`Are you sure you u want to leave "${selectedChat.name}"?`} btnText="Confirm" onCancle={() => setConfirmLeaveGroup(false)} onConfirm={() => removeUser("left")} />}


      <div className={`${styles.container}`}>

        {showAdminOptions && selectedUser._id !== user._id ? (
          <div
            className={`${styles.shadow} flex`}
            onClick={() => dispatch(handleShowAdminOptions(false))}
          >
            <div className={styles.user_options_container}>
              <div className={styles.user_details}>
                <img alt="" src={selectedUser.image} />
                <div className={styles.user_username}>
                  <span>{selectedUser.username}</span>
                  <span>{selectedUser.email}</span>
                </div>
              </div>
              <div className={styles.options}>
                <p onClick={() => loadChat(dispatch, navigate, user, selectedUser, socket)}>Message {selectedUser.username}</p>
                {
                  //@ts-ignore
                  selectedChat.admins.includes(user._id) && (selectedChat.admins.includes(selectedUser._id) ? (
                    <p onClick={() => promoteOrDemoteAdmin("demote")}>
                      Remove {selectedUser.username} from admin
                    </p>
                  ) : (
                    <p onClick={() => promoteOrDemoteAdmin("promote")}>
                      Promote {selectedUser.username} to admin
                    </p>
                  ))}
                {
                  //@ts-ignore
                  selectedChat.admins.includes(user._id) && <p onClick={() => removeUser("remove")}>
                    Remove {selectedUser.username} from group
                  </p>}
              </div>
            </div>
          </div>
        ) : null}

        <AiOutlineClose className={styles.dclc} onClick={() => { dispatch(handleShowProfile(false)); dispatch(handleShowAdminOptions(false)) }} />
        <>
          <ProfileDetails data={chatInfo(selectedChat, user)} />

          {isGroupChat && (
            <div
              className={styles.component}
              style={{
                width: "100%",
                padding: "15px 0px",
                borderTop: "1px solid var(--lighter-background)",
              }}
            >
              <span style={{ color: "var(--primary-text-color)" }}>Members</span>

              <div style={{ width: "100%" }}>
                {selectedChat.users.map((data: UserType) => {
                  return (
                    <UserBox
                      isAdminTagNeeded={true}
                      getChat={true}
                      user={data}
                      socket={socket}
                      setSelectedUser={setSelectedUser}
                    // func={addUser}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {isGroupChat && (
            <div
              className={styles.component}
              style={{
                width: "100%",
                padding: "15px 0px",
                borderTop: "1px solid var(--lighter-background)",
              }}
            >
              <span style={{ color: "var(--primary-text-color)" }}>
                Add Members
              </span>

              <Input
                onInput={(e: any) => {
                  setSearchQuery(e.target.value);
                  searchUsers(setSearchResults, setLoading, e.target.value)
                }}
                value={searchQuery}
                style={{
                  padding: "15px 20px",
                  background: "var(--light-background)",
                  width: "100%",
                  fontSize: "17px",
                  borderRadius: "10px",
                  margin: "10px 0px",
                }}
                placeholder="Search users"
              />

              <div
                style={{ width: "100%", height: "200px", overflowY: "scroll" }}
                className={styles.nnn}
              >
                {loading ? (
                  <Loader />
                ) : searchResults.filter((data: UserType) => !selectedChat.users.map((u: UserType) => u._id).includes(data._id)).length > 0 && searchQuery.trim().length > 0 ? (
                  searchResults.filter((data: UserType) => !selectedChat.users.map((u: UserType) => u._id).includes(data._id)).map((data: UserType) => {
                    return (
                      <UserBox
                        isAdminTagNeeded={false}
                        func={addUser}
                        getChat={false}
                        user={data}
                        socket={socket}
                        setSearchQuery={setSearchQuery}
                      />
                    );
                  })
                ) : (
                  <div style={{ width: "100%", height: "200px" }} className="flex">
                    <p>
                      {searchQuery.trim().length > 0 ? (
                        "No user found"
                      ) : (
                        <RiUserSearchLine
                          style={{
                            color: "var(--secondary-text-color)",
                            fontSize: "80px",
                          }}
                        />
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <MediaAndFiles
            data={selectedChat.mediaFiles}
            elemPerRow={4}
            heading={true}
          />
          <div className={styles.part_two} style={{ marginTop: "10px" }}>
            <input type="file" ref={inputRef} onChange={uploadCustomTheme} style={{ display: "none" }} />
            <p>Change Theme</p>
            <ul style={{ rowGap: "7px" }}>
              {themes.map((theme) => {
                return (
                  <li
                    style={{
                      border:
                        theme.name === selectedChat.theme?.name
                          ? "2px solid var(--lighter-highlight-background)"
                          : "2px solid var(--lighter-background)",
                    }}
                    key={theme.name}
                    onClick={() => changeTheme(theme, selectedChat, null)
                    }
                  >
                    <img src={theme.URL} alt={theme.name} />
                  </li>
                );
              })}
              <li style={{ border: "2px solid var(--lighter-background)" }} onClick={() => inputRef.current.click()}>
                <IoMdAdd />
              </li>
            </ul>
          </div>


          <div style={{ marginTop: "20px", width: "100%" }}>
            {selectedChat.isGroupChat ? !selectedChat.removedUsers.includes(user._id) &&
              <Button onClick={() => setConfirmLeaveGroup(true)} style={{ padding: "13px", fontSize: "0.8rem", color: "var(--primary-text-color)", background: "var(--lighter-background)", width: "100%", borderRadius: "7px" }} children="Leave group" />
              :
              <Button onClick={() => blockAndUnblockUser(isUserBlocked ? "un-block" : "block")} style={{ padding: "13px", fontSize: "0.8rem", color: "var(--primary-text-color)", background: "var(--lighter-background)", width: "100%", borderRadius: "7px" }} children={isUserBlocked ? `UnBlock ${chatInfo(selectedChat, user).name}` : `Block ${chatInfo(selectedChat, user).name}`} />}
          </div>

        </>
      </div>
    </>
  );
};

export default Profile;
