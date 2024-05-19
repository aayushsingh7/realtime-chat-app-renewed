import { ChatType, MessageType } from "../types/types";

const isNewUserMessage = (selectedChat: ChatType, message: MessageType) => {
  const currentMessage = message;
  const prevMessage =
    selectedChat.messages[selectedChat.messages.indexOf(message) - 1];
  if (!currentMessage || !prevMessage) return false;
  const isNewMessage = currentMessage.sender._id === prevMessage.sender._id;
  return isNewMessage;
};

export default isNewUserMessage;
