import { ChatType, UserType } from "../types/types";

const chatInfo = (
  chat: ChatType,
  loggedInUser: UserType
): ChatType | UserType => {
  if (!chat || !loggedInUser) return chat ? chat : loggedInUser;
  if (chat.isGroupChat) {
    return chat;
  } else {
    const secondUser: any = chat.users.find(
      (user) => user._id !== loggedInUser._id
    );
    return {
      ...chat,
      _id: secondUser._id,
      name: secondUser.name,
      image: secondUser.image,
      email: secondUser?.email,
      slogan: secondUser?.slogan,
      blockedUsers: secondUser?.blockedUsers,
      lastSeen: secondUser?.lastSeen,
      activeStatus: secondUser?.activeStatus,
    };
  }
};

export default chatInfo;
