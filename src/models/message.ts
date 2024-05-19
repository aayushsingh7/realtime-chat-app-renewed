import { MessageType } from "../types/types";
import { user } from "./user";

export const message: MessageType = {
  _id: "",
  document: false,
  message: "",
  msgType: "",
  seenBy: [],
  sender: user,
  starredBy: [],
};
