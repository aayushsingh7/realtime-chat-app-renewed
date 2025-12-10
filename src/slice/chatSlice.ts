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
  chats: [],
  selectedChat: {},
  messages: [],
  lastSeenMessagePerChat: {},
  participants: {},
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
      `${import.meta.env.VITE_API_URL}/messages?chatId=${chatId}&offset=${0}`,
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
      // When selecting a chat, we set the details but clear messages
      // until fetchMessages populates the separate messages array.
      state.selectedChat = action.payload._id ? action.payload : {};
      state.messages = [];
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
            // messages: chat.messages, // REMOVED: Chat model no longer holds messages
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
      // NEW: Update state.messages directly
      state.messages = [...state.messages, action.payload];

      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === state.selectedChat._id) {
            return {
              ...chat,
              // REMOVED: messages array update inside chat
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

      // NEW: Update state.messages instead of selectedChat.messages
      if (dummyMessageId) {
        // window.alert("dummayMessageId")
        state.messages = state.messages.map((message: MessageType) => {
          if (message._id === dummyMessageId) {
            return { ...newMessage, message: message.message };
          } else {
            return message;
          }
        });
        state.selectedChat.latestMessage = newMessage;
      } else {
        // window.alert("normal message")
        state.messages.push(newMessage);
        state.selectedChat.latestMessage = newMessage;
      }

      //@ts-ignore
      if (
        state.lastSeenMessagePerChat[state.selectedChat._id].lastSeenMessage <
        newMessage._id
      ) {
        //@ts-ignore
        state.lastSeenMessagePerChat[state.selectedChat._id].unreadCount += 1;
      }
      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === state.selectedChat._id) {
            return {
              ...chat,
              // REMOVED: messages array update inside chat
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
      if (
        state.lastSeenMessagePerChat[chatId].lastSeenMessage < newMessage._id
      ) {
        //@ts-ignore
        state.lastSeenMessagePerChat[chatId].unreadCount += 1;
      }

      //@ts-ignore
      state.chats = state.chats
        .map((chat: ChatType) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              // REMOVED: messages array update inside chat
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

      // NEW: Update state.messages
      state.messages = state.messages.map((message: MessageType) => {
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
      });
    },
    removeReactionFromMessage(state, action) {
      const { messageId, userId } = action.payload;

      // NEW: Update state.messages
      //@ts-ignore
      state.messages = state.messages.map((message: MessageType) => {
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
        }
        return message;
      });
    },
    selectMessage(state, action) {
      state.selectedMessage = action.payload;
    },
    deleteForMe(state, action) {
      const { messageIds }: { messageIds: string[] } = action.payload;

      // NEW: Filter state.messages
      state.messages = state.messages.filter((message: MessageType) => {
        return !messageIds.includes(message._id);
      });

      // Update latest message in chats list
      state.chats = state.chats.map((chat: ChatType) => {
        if (chat._id === state.selectedChat._id) {
          return {
            ...chat,
            latestMessage: state.messages[state.messages.length - 1], // Check state.messages
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

      // NEW: Filter state.messages
      state.messages = state.messages.filter((message: MessageType) => {
        return !messageIds.includes(message._id);
      });

      state.chats = state.chats.map((chat: ChatType) => {
        if (chat._id === state.selectedChat._id) {
          return {
            ...chat,
            latestMessage: state.messages[state.messages.length - 1],
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
    // starMessages(state, action) {
    //   const {
    //     messageIds,
    //     userId,
    //   }: { messageIds: string[]; chatId: string; userId: string } =
    //     action.payload;

    // },
    // removeStarredMessage(state, action) {
    //   const {
    //     messageIds,
    //     userId,
    //   }: { messageIds: string[]; chatId: string; userId: string } =
    //     action.payload;

    //   // NEW: Update state.messages
    //   state.messages = state.messages.map((message: MessageType) => {
    //     if (messageIds.includes(message._id)) {
    //       return {
    //         ...message,
    //         starredBy: message.starredBy.filter(
    //           (data: any) => data.userId !== userId
    //         ),
    //       };
    //     } else {
    //       return message;
    //     }
    //   });
    //   state.starredMessages = state.starredMessages.filter(
    //     (message: MessageType) => !messageIds.includes(message._id)
    //   );
    // },
    setMoreMessages(state, action) {
      const { chatId, messages }: { chatId: string; messages: MessageType[] } =
        action.payload;
      if (state.selectedChat._id === chatId) {
        // NEW: Update state.messages
        state.messages = [...messages.reverse(), ...state.messages];
      }
    },
    addUserInGroup(state, action) {
      const { newUser } = action.payload;
      state.selectedChat.users.push(newUser);
      state.selectedChat.isRemoved.status = false;
      state.chats = state.chats.map((chat: any) => {
        if (chat._id == state.selectedChat._id) {
          return {
            ...chat,
            isRemoved: { status: false },
            users: [...chat.users, newUser],
          };
        } else {
          return chat;
        }
      });
    },
    removeUserFromGroup(state, action) {
      const { newUser } = action.payload;
      state.selectedChat.users = state.selectedChat.users.filter(
        (user: any) => user._id !== newUser._id
      );
      state.selectedChat.isRemoved.status = true;

      state.chats = state.chats.map((chat: any) => {
        if (chat._id === state.selectedChat._id) {
          return {
            ...chat,
            users: state.selectedChat.users,
            isRemoved: { status: true },
          };
        } else {
          return chat;
        }
      });
    },
    promoteAdmin(state, action) {
      const { userId } = action.payload;

      state.selectedChat.admins.push(userId);
      state.chats = state.chats.map((chat: any) => {
        if (chat._id === state.selectedChat._id) {
          return { ...chat, admins: state.selectedChat.admins };
        } else {
          return chat;
        }
      });
    },

    removeFromAdmin(state, action) {
      const { userId } = action.payload;
      state.selectedChat.admins = state.selectedChat.admins.filter(
        (uId: string) => uId !== userId
      );

      state.chats = state.chats.map((chat: any) => {
        if (chat._id === state.selectedChat._id) {
          return { ...chat, admins: state.selectedChat.admins };
        } else {
          return chat;
        }
      });
    },
    handleShowStarredMessages(state, action) {
      state.showStarredMessages = action.payload;
    },
    setStarredMessages(state, action) {
      state.starredMessages = action.payload;
    },
    messageSeen(state, action) {
      const { messageIds, chatId, user } = action.payload;
    },
    handleShowChats(state, action) {
      state.showChats = action.payload;
    },
    leaveGroup(state, action) {
      const { userId } = action.payload;
      state.selectedChat.users = state.selectedChat.users.filter(
        (u: any) => u._id != userId
      );
      state.selectedChat.isRemoved.status = true;
      state.chats = state.chats.map((chat: any) => {
        if (chat._id == state.selectedChat._id) {
          return {
            ...chat,
            isRemoved: { status: true },
            users: state.selectedChat.users,
          };
        } else {
          return chat;
        }
      });
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
    blockCurrChat(state, action) {
      console.log("TRIGGERED");
      //@ts-expect-error
      state.selectedChat.isBlocked = true;
    },
    updateChatLastSeen(state, action) {
      const { chatId, messageId, userId } = action.payload;
      //@ts-ignore
      state.lastSeenMessagePerChat[chatId] = {
        lastSeenMessage: messageId,
        unreadCount: 0,
      };
      // @ts-ignore
      state.participants[userId] = messageId;
    },
    updateParticipantLastSeen(state, action) {
      const { userId, messageId } = action.payload;

      // Force a new reference assignment
      state.participants = {  
        ...state.participants,
        [userId]: messageId,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.chatsLoading = true;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload.chats;
      state.lastSeenMessagePerChat = Object.fromEntries(
        action.payload.lastSeenMessagePerChat.map((m: any) => [
          m.chat,
          { lastSeenMessage: m.lastSeenMessage, unreadCount: m.unreadCount },
        ])
      );
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
      const { chat, messages, isMore, user } = action.payload;

      // Update selectedChat metadata if provided (but WITHOUT messages field)
      if (chat) {
        state.selectedChat = { ...chat };
      }

      // NEW: Populate state.messages directly
      // Assuming payload now returns 'messages' separate from 'chat'
      state.messages = messages ? messages.reverse() : [];
      console.log(state.messages);
      //@ts-ignore
      state.lastSeenMessagePerChat[state.selectedChat._id] = {
        lastSeenMessage: state.selectedChat.latestMessage._id,
        unreadCount: 0,
      };
      state.participants = Object.fromEntries(
        action.payload.participants.map((m: any) => [m.user, m.lastSeenMessage])
      );
      state.participants[user] = state.selectedChat.latestMessage._id;
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
  updateParticipantLastSeen,
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
  setMoreMessages,
  updateChats,
  addUserInGroup,
  removeUserFromGroup,
  promoteAdmin,
  removeFromAdmin,
  handleShowStarredMessages,
  setStarredMessages,
  messageSeen,
  removeReactionFromMessage,
  handleShowChats,
  leaveGroup,
  blockCurrChat,
  handleIsMoreMessages,
  handleIsMoreChats,
  setMoreLoadedChats,
  handleFetchChat,
  updateChatLastSeen,
} = chatSlice.actions;

export default chatSlice.reducer;
