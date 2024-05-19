import { Dispatch } from "@reduxjs/toolkit";
import { removeStarredMessage, starMessages } from "../slice/chatSlice";

const starredMessagesFunc = async (
  messageIds: string[],
  userId: string,
  chatId: string,
  dispatch: Dispatch,
  isRemoveStarredMessage: boolean
) => {
  try {
    isRemoveStarredMessage
      ? dispatch(
          removeStarredMessage({
            messageIds: messageIds,
            userId: userId,
          })
        )
      : dispatch(
          starMessages({
            messageIds: messageIds,
            userId: userId,
          })
        );
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${
        isRemoveStarredMessage
          ? "/remove-from-star-messages"
          : "add-to-star-messages"
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
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export default starredMessagesFunc;
