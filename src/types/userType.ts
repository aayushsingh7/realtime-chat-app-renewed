import type {IStatus} from "./statusType";

interface IUser {
    _id: string;
    name: string;
    image: string;
    email?: string;
    blockedUsers: string[];
    starredMessages: string[];
    onlineStatus: boolean;
    lastSeen: Date;
    description: string;
    role: "admin" | "user" | "guest";
    username: string;
    slogan: string;
    createdAt: Date;
    activeStatus: boolean;
    status: IStatus;
    clearedChats: Record<string, Date>;
    deletedChats: Record<string, Date>;
}

export type {IUser};
