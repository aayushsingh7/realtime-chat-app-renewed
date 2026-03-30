import type {IUser} from "./userType";

interface IChatMember {
    _id: string;
    user: string;
    chat: string;
    unreadCount: number;
    lastReadAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IChatMemberPopulated extends Omit<IChatMember, "user"> {
    user: IUser;
}

export type {IChatMember, IChatMemberPopulated};
