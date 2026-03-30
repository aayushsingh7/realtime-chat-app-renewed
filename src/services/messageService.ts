import api from "../utils/axios";

type MessageRef = {
    message:string;
    msgType:string;
    chatId:string;
    file_url:string | null;
    fileName: string | null;
    document: string | null;
    fileSize: number | null;
    isReply: boolean;
    repliedTo: string | null;
    caption: string | null;
};

export const getMessages = (data:{chatId:string; offset:number})=> api.get(`/messages?chatId=${data.chatId}&offset=${data.offset}`)
export const createMessage = (data:MessageRef) => api.post("/messages", data);
export const addReaction = (data:{messageId:string; emoji:string}) => api.put(`/messages/${data.messageId}/reactions`, {emoji:data.emoji})
export const removeReaction = (data: {messageId: string; emoji: string}) =>
    api.delete(`/messages/${data.messageId}/reactions`);
export const deleteMessage = (data:{messageIds:string; chatId:string;}) => api.delete(`/messages`, {data});
