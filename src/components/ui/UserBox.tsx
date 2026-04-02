interface UserBoxProps {
    member: {
        name: string;
        id: string;
        initial: string;
        status: string;
        color: string;
    };
}

const UserBox: React.FC<UserBoxProps> = ({member}) => {
    return (
        <div
            key={member.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
        >
            <div
                className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold text-white ${member.color}`}
            >
                {member.initial}
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[15px] text-zinc-100 font-medium truncate">{member.name}</span>
                <span
                    className={`text-[13px] truncate ${
                        member.status === "online" ? "text-[#7e57c2]" : "text-zinc-500"
                    }`}
                >
                    {member.status}
                </span>
            </div>
        </div>
    );
};

export default UserBox;
