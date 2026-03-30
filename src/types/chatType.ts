import type {IMessage} from "./messageType";
import type {IUser} from "./userType";

interface IChat {
    _id: string;
    isGroupChat: boolean;
    admins: string[];
    users: string[];
    latestMessage: string | IMessage;
    createdBy: string;
    image: string;
    name: string;
    description: string;
    removedUsers: Record<string, Date>;
    theme: {
        URL: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

interface IChatPopulated extends Omit<IChat, "users" | "latestMessage"> {
    users: IUser[];
    latestMessage: IMessage;
}

export type {IChat, IChatPopulated};
