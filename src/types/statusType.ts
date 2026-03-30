interface IStatus {
    _id: string;
    extension: string;
    fileType: string;
    url: string;
    postedBy: string;
    seenBy: string[];
    chatId: string;
}

export type {IStatus};
