import { Dispatch } from "@reduxjs/toolkit";
import { removeStarredMessages, starMessages } from "../slice/userSlice";

const starredMessagesFunc = async (
  messageIds: string[],
  userId: string,
  chatId: string,
  dispatch: Dispatch,
  isRemoveStarredMessage: boolean
) => {
  console.log("function triggered", isRemoveStarredMessage);

  try {
    if (isRemoveStarredMessage) {
      dispatch(
        removeStarredMessages(messageIds)
      );
    } else {
      dispatch(
        starMessages(messageIds) 
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/messages/star`,
      {
        method: isRemoveStarredMessage ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messageIds,
          userId,
          chatId,
        }),
      }
    );
    const data = await response.json();
  } catch (err) {
    console.error("Error in starredMessagesFunc:", err);
  }
};

export default starredMessagesFunc;