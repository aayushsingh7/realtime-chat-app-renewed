import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chat } from "../models/chat";
import { message } from "../models/message";
import {
  ChatType,
  MessageType,
  ReactMessageType,
  UserType,
} from "../types/types";

const initialState = {
  chats: [chat],
  selectedChat: chat,
  messagesLoading: true,
  chatsLoading: true,
  viewMessage: message,
  createNewChatLoading: false,
  createGroup: false,
  selectMessagesOption: false,
  showMessageOptions: false,
  selectedMessage: message,
  isReplying: false,
  showStarredMessages: false,
  starredMessages: [],
  showChats: true,
  isMoreMessages: false,
  isMoreChats: false,
  fetchChat: true,
};

export const fetchChats = createAsyncThunk("userSlice/fetchChats", async () => {
  console.log("Fetch Chats are working fine");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data;
});

export const fetchMessages = createAsyncThunk(
  "chatSlice/fetchMessages",
  async (chatId: string) => {
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/getChat?chatId=${chatId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    // dispatch(setSelectedChat({ chatId: chat._id, filtering: true }));
    return data;
  }
);

export const fetchStarredMessages = createAsyncThunk(
  "chatSlice/fetchStarredMessages",
  async () => {
    console.log("abe ho jana");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/starred-messages`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    const { messages } = await response.json();
    return messages;
  }
);

const chatSlice = createSlice({
  name: "chatSlice",
  initialState: initialState,
  reducers: {
    // CHATS OPERATIONS
    setChats(state, action) {
      state.chats = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload._id
        ? {
            ...action.payload,
            messages: action.payload.messages,
          }
        : {};
    },
    handleMessagesLoading(state, action) {
      state.messagesLoading = action.payload;
    },
    handleChatsLoading(state, action) {
      state.chatsLoading = action.payload;
    },
    setMoreLoadedChats(state, action) {
      state.chats = [...state.chats, ...action.payload];
    },
    // MESSAGES OPERATIONS
    setViewMessage(state, action) {
      state.viewMessage = action.payload;
    },
    changeTheme(state, action) {
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          theme: action.payload,
        },
      };
    },
    addChat(state, action) {
      const { chat } = action.payload;
      const isChatAlreadyExists = state.chats.find(
        (c: ChatType) => c._id === chat._id
      );
      if (!isChatAlreadyExists) {
        state.chats = [
          {
            admins: chat.admins,
            createdAt: chat.createdAt,
            createdBy: chat.createdBy,
            removedUsers: chat.removedUsers,
            users: chat.users,
            _id: chat._id,
            messages: chat.messages,
            image: chat.image,
            name: chat.name,
            description: chat.description,
            isGroupChat: chat.isGroupChat,
            updatedAt: chat.updatedAt,
            latestMessage: chat.latestMessage ? chat.latestMessage : {},
            theme: {
              URL: "https://i.pinimg.com/736x/ba/c8/15/bac815fbeff16270f635ad30c00d71f6.jpg",
              name: "default",
            },
          },
          ...state.chats,
        ];
      }
    },
    selectExistingChat(state, action) {
      const { chat } = action.payload;
      //@ts-ignore
      state.chats = state.chats
        .map((c: ChatType) => {
          if (c._id === chat._id) {
            return {
              ...c,
              createdAt: new Date(Date.now()),
            };
          } else {
            return c;
          }
        })
        .sort(
          //@ts-ignore
          (a: any, b: any) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      return state;
    },
    handleCreateNewChatLoading(state, action) {
      state.createNewChatLoading = action.payload;
    },
    handleCreateGroup(state, action) {
      state.createGroup = action.payload;
    },
    sendingMessage(state, action) {
      state.selectedChat = {
        ...state.selectedChat,
        messages: [...state.selectedChat.messages, action.payload],
      };
      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === state.selectedChat._id) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  _id: action.payload._id,
                  seenBy: action.payload.seenBy,
                  status: "sending",
                },
              ],
              latestMessage: action.payload,
              updatedAt: new Date().toISOString(),
            };
          } else {
            return chat;
          }
        })
        .sort(
          //@ts-ignore
          (a: any, b: any) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    },
    addNewMessage(state, action) {
      const { dummyMessageId, newMessage } = action.payload;
      console.log("newMessage", newMessage);
      state.selectedChat = dummyMessageId
        ? {
            ...state.selectedChat,
            latestMessage: newMessage,
            messages: state.selectedChat.messages.map(
              (message: MessageType) => {
                if (message._id === dummyMessageId) {
                  return { ...newMessage, message: message.message };
                } else {
                  return message;
                }
              }
            ),
          }
        : {
            ...state.selectedChat,
            messages: [...state.selectedChat.messages, newMessage],
            latestMessage: newMessage,
          };
      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === state.selectedChat._id) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { _id: newMessage._id, seenBy: newMessage.seenBy },
              ],
              latestMessage: newMessage,
              updatedAt: new Date().toISOString(),
            };
          } else {
            return chat;
          }
        })
        .sort(
          //@ts-ignore
          (a: any, b: any) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    },
    updateChats(state, action) {
      const { newMessage, chatId } = action.payload;
      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { _id: newMessage._id, seenBy: newMessage.seenBy },
              ],
              latestMessage: newMessage,
              updatedAt: new Date().toISOString(),
            };
          } else {
            return chat;
          }
        })
        .sort(
          //@ts-ignore
          (a: any, b: any) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    },
    setSelectMessagesOption(state, action) {
      state.selectMessagesOption = action.payload;
    },
    handleShowMessageOption(state, action) {
      state.showMessageOptions = action.payload;
    },
    reactOnMessage(state, action) {
      const { messageId, reaction, user } = action.payload;

      state.selectedChat = {
        ...state.selectedChat,
        messages: state.selectedChat.messages.map((message: MessageType) => {
          if (message._id === messageId) {
            const existingReaction = message.reactEmoji?.find(
              (react) => react.user._id === user._id
            );

            if (existingReaction) {
              return {
                ...message,
                reactEmoji: message.reactEmoji?.map((r) =>
                  r.user._id === user._id ? { ...r, emoji: reaction } : r
                ),
              };
            } else {
              return {
                ...message,
                reactEmoji: [
                  ...(message.reactEmoji || []),
                  { user: user, emoji: reaction },
                ],
              };
            }
          } else {
            return message;
          }
        }),
      };
    },
    removeReactionFromMessage(state, action) {
      const { messageId, userId } = action.payload;

      state.selectedChat = {
        ...state.selectedChat,
        //@ts-ignore
        messages: state.selectedChat.messages.map((message: MessageType) => {
          if (message._id === messageId) {
            const existingReaction = message.reactEmoji?.find(
              (react: ReactMessageType) => react.user._id === userId
            );

            if (existingReaction) {
              return {
                ...message,
                //@ts-ignore
                reactEmoji: message.reactEmoji.filter(
                  (react: ReactMessageType) => react.user._id !== userId
                ),
              };
            }
          } else {
            return message;
          }
        }),
      };
    },
    selectMessage(state, action) {
      state.selectedMessage = action.payload;
    },
    deleteForMe(state, action) {
      const { messageIds }: { messageIds: string[] } = action.payload;
      state.selectedChat.messages = state.selectedChat.messages.filter(
        (message: MessageType) => {
          return !messageIds.includes(message._id);
        }
      );
      state.chats = state.chats.map((chat: ChatType) => {
        if (chat._id === state.selectedChat._id) {
          return {
            ...chat,
            latestMessage:
              state.selectedChat.messages[
                state.selectedChat.messages.length - 1
              ],
          };
        } else {
          return chat;
        }
      });
      state.selectMessagesOption = false;
      return state;
    },
    deleteForEveryone(state, action) {
      const { messageIds }: { messageIds: string[] } = action.payload;
      state.selectedChat.messages = state.selectedChat.messages.filter(
        (message: MessageType) => {
          return !messageIds.includes(message._id);
        }
      );
      state.chats = state.chats.map((chat: ChatType) => {
        if (chat._id === state.selectedChat._id) {
          return {
            ...chat,
            latestMessage:
              state.selectedChat.messages[
                state.selectedChat.messages.length - 1
              ],
          };
        } else {
          return chat;
        }
      });
      state.selectMessagesOption = false;
      return state;
    },
    handleIsReplying(state, action) {
      state.isReplying = action.payload;
    },
    starMessages(state, action) {
      const {
        messageIds,
        userId,
      }: { messageIds: string[]; chatId: string; userId: string } =
        action.payload;

      state.selectedChat = {
        ...state.selectedChat,
        messages: state.selectedChat.messages.map((message: MessageType) => {
          if (messageIds.includes(message._id)) {
            // Correcting the way to update the starredBy array
            return {
              ...message,
              starredBy: [
                ...message.starredBy,
                {
                  chatId: state.selectedChat._id,
                  userId: userId,
                },
              ],
            };
          } else {
            return message;
          }
        }),
      };
    },
    removeStarredMessage(state, action) {
      const {
        messageIds,
        userId,
      }: { messageIds: string[]; chatId: string; userId: string } =
        action.payload;

      state.selectedChat = {
        ...state.selectedChat,
        messages: state.selectedChat.messages.map((message: MessageType) => {
          if (messageIds.includes(message._id)) {
            return {
              ...message,
              starredBy: message.starredBy.filter(
                (data: any) => data.userId !== userId
              ),
            };
          } else {
            return message;
          }
        }),
      };
      state.starredMessages = state.starredMessages.filter(
        (message: MessageType) => !messageIds.includes(message._id)
      );
    },
    setMoreMessages(state, action) {
      const { chatId, messages }: { chatId: string; messages: MessageType[] } =
        action.payload;
      if (state.selectedChat._id === chatId) {
        state.selectedChat = {
          ...state.selectedChat,
          messages: [...messages.reverse(), ...state.selectedChat.messages],
        };
      }
    },
    addUserInGroup(state, action) {
      const { newUser } = action.payload;
      state.selectedChat.users = [...state.selectedChat.users, newUser];
      state.selectedChat.removedUsers = state.selectedChat.removedUsers.filter(
        (u: any) => u._id !== newUser._id
      );
      return state;
    },
    removeUserFromGroup(state, action) {
      const { newUser } = action.payload;
      state.selectedChat = {
        ...state.selectedChat,
        removedUsers: [
          //@ts-ignore
          ...state.selectedChat.removedUsers,
          { _id: newUser._id, createdAt: new Date().toISOString() },
        ],
        users: state.selectedChat.users.filter(
          (user: UserType) => user._id !== newUser._id
        ),
      };
    },
    promoteAdmin(state, action) {
      const { userId } = action.payload;
      state.selectedChat.admins = [...state.selectedChat.admins, userId];
      return state;
    },
    removeFromAdmin(state, action) {
      const { userId } = action.payload;
      //@ts-ignore
      state.selectedChat.admins = state.selectedChat.admins.filter(
        (uId: string) => uId !== userId
      );
      return state;
    },
    handleShowStarredMessages(state, action) {
      state.showStarredMessages = action.payload;
    },
    setStarredMessages(state, action) {
      state.starredMessages = action.payload;
    },
    messageSeen(state, action) {
      const { messageIds, chatId, user } = action.payload;
      state.selectedChat = {
        ...state.selectedChat,
        latestMessage: {
          ...state.selectedChat.latestMessage,
          seenBy: [
            //@ts-ignore
            ...state.selectedChat.latestMessage.seenBy,
            { _id: user._id, username: user.username },
          ],
        },
        //@ts-ignore
        messages: state.selectedChat.messages.map((message: MessageType) => {
          if (messageIds.includes(message._id)) {
            return {
              ...message,
              seenBy: [
                ...message.seenBy,
                { _id: user._id, username: user.username },
              ],
            };
          } else {
            return message;
          }
        }),
      };

      //@ts-ignore
      state.chats = state.chats.map((chat: ChatType) => {
        if (chat._id === chatId) {
          return {
            ...chat,
            latestMessage: {
              ...chat.latestMessage,
              seenBy: [
                ...chat.latestMessage.seenBy,
                { _id: user._id, username: user.username },
              ],
            },
            messages: chat.messages.map((message: MessageType) => {
              if (messageIds.includes(message._id)) {
                return {
                  ...message,
                  seenBy: [
                    ...message.seenBy,
                    { _id: user._id, username: user.username },
                  ],
                };
              } else {
                return message;
              }
            }),
          };
        } else {
          return chat;
        }
      });
    },
    handleShowChats(state, action) {
      state.showChats = action.payload;
    },
    blockUser(state, action) {
      const { userId, blockedUserId } = action.payload;
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          users: state.selectedChat.users.map((user) => {
            if (user._id === userId) {
              return {
                ...user,

                blockedUsers: user.blockedUsers
                  ? [...user.blockedUsers, blockedUserId]
                  : [blockedUserId],
              };
            }
            return user;
          }),
        },
      };
    },
    unBlockUser(state, action) {
      const { userId, blockedUserId } = action.payload;
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          users: state.selectedChat.users.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                //@ts-ignore
                blockedUsers: user.blockedUsers.filter(
                  (u: string) => u !== blockedUserId
                ),
              };
            }
            return user;
          }),
        },
      };
    },
    leaveGroup(state, action) {
      const { userId } = action.payload;
      state.selectedChat = {
        ...state.selectedChat,
        removedUsers: [
          //@ts-ignore
          ...state.selectedChat.removedUsers,
          { _id: userId, createdAt: new Date().toISOString() },
        ],
        users: state.selectedChat.users.filter(
          (user: UserType) => user._id !== userId
        ),
      };
    },
    handleIsMoreMessages(state, action) {
      state.isMoreMessages = action.payload;
    },
    handleIsMoreChats(state, action) {
      state.isMoreChats = action.payload;
    },
    handleFetchChat(state, action) {
      state.fetchChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.chatsLoading = true;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      console.log(action.payload);
      state.chats = action.payload.chats;
      state.isMoreChats = action.payload.isMore;
      state.chatsLoading = false;
    });
    builder.addCase(fetchChats.rejected, (state) => {
      state.chatsLoading = false;
    });
    builder.addCase(fetchMessages.pending, (state) => {
      state.messagesLoading = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messagesLoading = false;
      const { chat, isMore } = action.payload;
      state.selectedChat = {
        ...chat,
        messages: chat.messages.reverse(),
      };
      state.isMoreMessages = isMore;
    });
    builder.addCase(fetchMessages.rejected, (state) => {
      state.messagesLoading = false;
    });
    builder.addCase(fetchStarredMessages.pending, (state) => {
      state.chatsLoading = true;
    }),
      builder.addCase(fetchStarredMessages.fulfilled, (state, action) => {
        state.chatsLoading = false;
        state.starredMessages = action.payload;
      }),
      builder.addCase(fetchStarredMessages.rejected, (state) => {
        state.chatsLoading = false;
      });
  },
});

export const {
  setChats,
  setSelectedChat,
  handleMessagesLoading,
  handleChatsLoading,
  addNewMessage,
  setViewMessage,
  changeTheme,
  addChat,
  handleCreateNewChatLoading,
  selectExistingChat,
  handleCreateGroup,
  sendingMessage,
  setSelectMessagesOption,
  handleShowMessageOption,
  reactOnMessage,
  selectMessage,
  deleteForEveryone,
  deleteForMe,
  handleIsReplying,
  starMessages,
  setMoreMessages,
  updateChats,
  addUserInGroup,
  removeUserFromGroup,
  promoteAdmin,
  removeFromAdmin,
  handleShowStarredMessages,
  setStarredMessages,
  messageSeen,
  removeStarredMessage,
  removeReactionFromMessage,
  handleShowChats,
  blockUser,
  unBlockUser,
  leaveGroup,
  handleIsMoreMessages,
  handleIsMoreChats,
  setMoreLoadedChats,
  handleFetchChat,
} = chatSlice.actions;

export default chatSlice.reducer;
