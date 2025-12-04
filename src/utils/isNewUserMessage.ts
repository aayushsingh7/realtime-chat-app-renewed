import { ChatType, MessageType } from "../types/types";

const isNewUserMessage = (messages: MessageType[], message: MessageType) => {
  const currentMessage = message;
  const prevMessage = messages[messages.indexOf(message) - 1];
  if (!currentMessage || !prevMessage) return false;
  const isNewMessage = currentMessage.sender._id === prevMessage.sender._id;
  return isNewMessage;
};

export default isNewUserMessage;
