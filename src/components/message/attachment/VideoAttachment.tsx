import { FaPlay } from "react-icons/fa";
import type { IAttachment } from "../../../types/commonType";
import ProgressLoader from "../../ui/ProgressLoader";


interface VideoAttachmentProps {
    attachment: IAttachment;
    onClick: () => void;
    status:"sending" | "sent" | "delivered" | "seen" ;
    className?: string;
    progress:number;
}

const VideoAttachment:React.FC<VideoAttachmentProps> = ({attachment, onClick, className = "", status
, progress}) =>  {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative block w-full h-full rounded aspect-[1/1] overflow-hidden focus:outline-none group ${className}`}
        >
            {status == "sending" && (
                <div className="z-2 h-full w-full absolute bg-black/40 backdrop-blur-[4px] flex items-center justify-center">
                    <ProgressLoader progress={progress} />
                </div>
            )}
            <video src={attachment.url} className="w-full h-full object-cover" preload="metadata" muted playsInline />
            <div
                className={`absolute inset-0 bg-black/40 transition-colors duration-300 ${
                    status !== "sending" && "group-hover:bg-black/55"
                }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                {status !== "sending" && (
                    <span
                        className="flex items-center justify-center w-11 h-11 rounded-full
                         bg-white/20 border border-white/40 backdrop-blur-sm
                         group-hover:bg-white/30 group-hover:scale-110
                         transition-all duration-200 shadow-lg z-100"
                    >
                        <FaPlay className="w-5 h-5 fill-white ml-0.5" />
                    </span>
                )}
            </div>
        </button>
    );
}


export default VideoAttachment