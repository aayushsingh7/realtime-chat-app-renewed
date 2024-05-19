import { Dispatch } from "@reduxjs/toolkit";
import {
  handleFetchChat,
  handleMessagesLoading,
  handleShowChats,
  setSelectedChat,
  setSelectMessagesOption,
} from "../slice/chatSlice";
import { handleShowProfile, setIsError } from "../slice/utilitySlices";
import generateID from "./generateID";
import getSecondUserDetails from "./getSecondUserDetails";
import { UserType } from "../types/types";

const loadChat = async (
  dispatch: Dispatch,
  navigate: any,
  loggedInUser: UserType,
  user: UserType,
  socket: any,
  setSearchQuery?: any
) => {
  //@ts-ignore
  const dummyChat: ChatType = {
    users: [
      { name: user.name, image: user.image, _id: user._id },
      {
        name: loggedInUser.name,
        image: loggedInUser.image,
        _id: loggedInUser._id,
      },
    ],
    _id: generateID(),
    messages: [],
    image: getSecondUserDetails([user, loggedInUser], loggedInUser).image,
    name: getSecondUserDetails([user, loggedInUser], loggedInUser).name,
    slogan: getSecondUserDetails([user, loggedInUser], loggedInUser).slogan,
    mediaFiles: [],
    theme: {
      URL: "https://i.pinimg.com/736x/ba/c8/15/bac815fbeff16270f635ad30c00d71f6.jpg",
      name: "default",
    },
  };

  try {
    dispatch(setSelectMessagesOption(false));
    dispatch(setSelectedChat(dummyChat));
    navigate(`/chat/new-chat`);
    dispatch(handleShowChats(false));
    dispatch(handleMessagesLoading(true));
    dispatch(handleShowProfile(false));
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/getChat?userOne=${
        loggedInUser._id
      }&&userTwo=${user._id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (data.success) {
      socket.emit("create new chat", data.chat);
      setSearchQuery ? setSearchQuery("") : null;
      navigate(`/chat/${data.chat._id}`);
      dispatch(setSelectedChat(data.chat));
      dispatch(handleFetchChat(false));
    }
    dispatch(handleMessagesLoading(false));
  } catch (err) {
    dispatch(setIsError(true));
  }
};

export default loadChat;
