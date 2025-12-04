import { ChatType } from "../types/types";

const deleteMessage = async (
  userId: string,
  messageIds: string[],
  selectedChat: ChatType,
  socket: any
) => {
  socket.emit("delete message", userId, messageIds, selectedChat);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/delete-message`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messageIds,
          chatId:selectedChat._id
        }),
      }
    );
    const data = await response.json();
  } catch (err) {}
};

export default deleteMessage;
