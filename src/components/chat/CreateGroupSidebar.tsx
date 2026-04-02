import {useState} from "react";
import {FaCheck, FaPlus} from "react-icons/fa";
import {HiArrowNarrowLeft, HiArrowNarrowRight} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import {MdCheck} from "react-icons/md";
import UserBox from "../ui/UserBox";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface CreateGroupSidebarProps {}

const CreateGroupSidebar: React.FC<CreateGroupSidebarProps> = ({}) => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [tab, setTab] = useState<number>(1);
    const groupMembers: any = [
        {id: 1, name: "Suman 🥰Suman🥰", status: "last seen 1 hour ago", color: "bg-pink-400", initial: "S"},
        {id: 2, name: "Alex Doe", status: "online", color: "bg-blue-500", initial: "A"},
        {id: 3, name: "Sarah Smith", status: "last seen recently", color: "bg-emerald-500", initial: "S"},
        {id: 4, name: "John Dev", status: "last seen yesterday", color: "bg-orange-400", initial: "J"},
        {id: 3, name: "Sarah Smith", status: "last seen recently", color: "bg-emerald-500", initial: "S"},
        {id: 4, name: "John Dev", status: "last seen yesterday", color: "bg-orange-400", initial: "J"},
        {id: 3, name: "Sarah Smith", status: "last seen recently", color: "bg-emerald-500", initial: "S"},
        {id: 4, name: "John Dev", status: "last seen yesterday", color: "bg-orange-400", initial: "J"},
    ];

    return (
        <aside className="w-full h-screen flex flex-col justify-between bg-zinc-900 border-r-3 border-zinc-800 shrink-0 text-zinc-100 py-3 items-center">
            <div className="w-full px-4 flex flex-col flex-1 min-h-0">
                <div className="flex items-center mb-10 shrink-0">
                    <button className="mr-3 p-2 hover:bg-zinc-800 hover:text-zinc-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700">
                        <IoMdClose className="text-2xl text-zinc-400" />
                    </button>
                    <h2 className="text-white font-medium text-lg">Create new group</h2>
                </div>

                {tab == 1 ? (
                    <form className="flex flex-col items-center overflow-y-auto min-h-0 flex-1">
                        <input hidden id="group-pic" type="file" />
                        <label
                            htmlFor="group-pic"
                            className="relative cursor-pointer flex w-30 h-30 bg-zinc-700 rounded-full shrink-0"
                        >
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Group Pic"
                                    className="w-30 h-30 bg-zinc-700 rounded-full outline-none border-none object-cover"
                                />
                            )}
                            <span>
                                <FaPlus className="absolute bottom-2 right-1 text-xl w-7 h-7 p-1 rounded-full bg-violet-600" />
                            </span>
                        </label>

                        <br />
                        <br />

                        <Input placeholder="Group name here" />

                        <textarea
                            placeholder="Group description here (optional)"
                            className="resize-none w-full mt-3 bg-zinc-800 text-zinc-100 text-[15px] rounded-[10px] py-3 pl-4 pr-4 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-shadow placeholder-zinc-400 h-40 shrink-0"
                        ></textarea>
                    </form>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0">
                        <Input placeholder="Group name here" />

                        <div className="overflow-y-auto mt-10 flex-1">
                            {groupMembers.map((member: any, index: number) => (
                                <UserBox key={index} member={member} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-10 shrink-0 pt-4">
                {tab == 2 && (
                    <Button
                        className="w-13 h-13 bg-zinc-800 flex items-center justify-center mb-5 hover:bg-zinc-700 focus:ring-0"
                        variant="icon"
                        iconClassName="text-white"
                        Icon={HiArrowNarrowLeft}
                        iconSize={30}
                        onClick={() => setTab(1)}
                    />
                )}
                <Button
                    variant="icon"
                    onClick={() => (tab == 2 ? console.log("group created!") : setTab(tab + 1))}
                    className="w-13 h-13 bg-violet-600 flex items-center justify-center mb-5 hover:bg-violet-500 focus:ring-0"
                    iconClassName="text-white "
                    Icon={tab == 1 ? HiArrowNarrowRight : MdCheck}
                    iconSize={30}
                />
            </div>
        </aside>
    );
};

export default CreateGroupSidebar;
