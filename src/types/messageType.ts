type MessageType = "text" | "image" | "video" | "alert" | "pdf" | string;

interface IEmoji {
    user: string;
    emoji: string;
}

interface IMessage {
    _id: string;
    sender: string;
    message: string;
    msgType: MessageType;
    reactEmoji: IEmoji;
    document: boolean;
    actor: {
        _id: string;
        name: string;
    };
    target: {
        _id: string;
        name: string;
    };
    fileName: string;
    caption: string;
    isReply: boolean;
    repliedTo: string;
    fileSize: number;
    chat: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IAlertMessage {
    chatId: string;
    actor: {
        _id: string;
        name: string;
    };
    message: string;
    target?: {
        _id: string;
        name: string;
    };
    id?: string;
}

export type {IMessage, IAlertMessage, IEmoji, MessageType};
