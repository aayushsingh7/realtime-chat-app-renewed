import api from "../utils/axios";

type UserRef = {
    _id: string;
    name: string;
};

export const getChats = () => api.get("/chats");
export const loadMoreChats = (offset: number) => api.get(`/chats/load-more?offset=${offset}`);
export const getChat = (data: {userOne: string; userTwo: string; chatId: string; isGroupChat: boolean}) =>
    api.post("/chats", data);
export const addAdmin = (data: {target: UserRef; actor: UserRef; chatId: string}) =>
    api.put(`/groups/${data.chatId}/admins/promote`);
export const removeAdmin = (data: {target: UserRef; actor: UserRef; chatId: string}) =>
    api.put(`/groups/${data.chatId}/admins/demote`);
export const addUser = (data: {target: UserRef; actor: UserRef; chatId: string}) =>
    api.put(`/groups/${data.chatId}/users/add`);
export const removeUser = (data: {target: UserRef; actor: UserRef; chatId: string}) =>
    api.put(`/groups/${data.chatId}/users/remove`);