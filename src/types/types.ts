interface ThemeType {
  URL: string;
  name: string;
}

export interface MixedType {
  _id: string;
  image: string;
  email: string;
  name: string;
  slogan: string;
  blockedUsers: Array<string>;
  lastSeen: Date;
}

export interface Notification_Settings {
  messages_notifications: boolean;
  react_on_message_notifications: boolean;
  calls_notifications: boolean;
  media_preview: boolean;
  text_preview: boolean;
}

export interface ReactMessageType {
  user: UserType;
  emoji: string;
}

export interface StarredMessageType {
  chatId: string;
  userId: string;
}

export interface MediaFilesTypes {
  _id: string;
  extension: string;
  msgType: string;
  message: string;
  document: boolean;
}

export interface UserType {
  _id: string;
  name: string;
  image: string;
  email?: string;
  password?: string;
  blockedUsers?: Array<string>;
  onlineStatus?: boolean;
  lastSeen?: Date;
  description?: string;
  role?: string;
  username?: string;
  slogan?: string;
  createdAt?: Date;
  activeStatus?: boolean;
  latestStatus?: StatusType;
}

export interface MessageType {
  _id: string;
  sender: UserType;
  msgType: string;
  message: string;
  document: boolean;
  seenBy: Array<UserType>;
  reactEmoji?: Array<ReactMessageType>;
  fileName?: string | null;
  moderator?: UserType;
  user?: UserType;
  caption?: string;
  isReply?: boolean;
  repliedTo?: MessageType;
  status?: string;
  fileSize?: number;
  createdAt?: string;
  starredBy: Array<StarredMessageType>;
  eventPerformed?: string;
  chat?: ChatType;
}

export interface ChatType {
  _id: string;
  isGroupChat: boolean;
  admins: Array<UserType>;
  users: Array<UserType>;
  latestMessage: MessageType;
  messages: Array<MessageType>;
  createdBy: UserType;
  image: string;
  name: string;
  description: string;
  removedUsers: Array<UserType>;
  createdAt: string;
  updatedAt: string;
  slogan?: string;
  mediaFiles?: Array<MediaFilesTypes>;
  theme?: ThemeType;
  email?: string;
}

export interface StatusType {
  _id: string;
  extension: string;
  fileType: string;
  url: string;
  postedBy: UserType;
  seenBy: Array<string>;
  chatId: string;
  createdAt: Date;
}
