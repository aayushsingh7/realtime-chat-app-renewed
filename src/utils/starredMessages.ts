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
        removeStarredMessages(messageIds) // Pass ONLY the array
      );
    } else {
      dispatch(
        starMessages(messageIds) // Pass ONLY the array
      );
    }

    // Now this will run because the error above is gone
    window.alert("Api call starting..."); 

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${
        isRemoveStarredMessage
          ? "/remove-from-star-messages"
          : "/add-to-star-messages"
      }`,
      {
        method: "PUT",
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
    // IMPORTANT: Always log the error so you aren't working in the dark!
    console.error("Error in starredMessagesFunc:", err);
  }
};

export default starredMessagesFunc;