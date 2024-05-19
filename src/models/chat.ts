import { ChatType } from "../types/types";
import { message } from "./message";
import { user } from "./user";

export const chat: ChatType = {
  _id: "",
  admins: [],
  createdAt: "",
  createdBy: user,
  description: "",
  image: "",
  isGroupChat: false,
  latestMessage: message,
  messages: [],
  name: "",
  removedUsers: [],
  updatedAt: "",
  users: [],
  mediaFiles: [],
  slogan: "",
};
