import { MessageType, UserType } from "../types/types";

const alertMessageFunc = async (
  chatId: string,
  message: string,
  moderator: UserType,
  user: UserType | null,
  eventPerformed: string
): Promise<MessageType | undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/group-chat/alert-message`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message,
          moderator: { _id: moderator._id, name: moderator.name },
          user: user ? { _id: user._id, name: user.name } : null,
          msgType: "alert",
          eventPerformed,
        }),
      }
    );
    if (response.status === 200) {
      const { alertMessage }: { alertMessage: MessageType } =
        await response.json();
      return alertMessage;
    }
  } catch (err) {}
};

export default alertMessageFunc;
