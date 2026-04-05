import type {IAttachment, MessageStatus} from "../../../types/commonType";
import ProgressLoader from "../../ui/ProgressLoader";

interface ImageAttachmentProps {
    attachment: IAttachment;
    onClick: () => void;
    progress:number;
    className?: string;
    status: MessageStatus;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = ({attachment,status, onClick, className = "", progress}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative block w-full overflow-hidden focus:outline-none group ${className}`}
        >
            {status == "sending" && (
                <div className="z-2 h-full w-full absolute bg-black/40 backdrop-blur-[4px] flex items-center justify-center">
                    <ProgressLoader progress={progress} />
                </div>
            )}
            <img
                src={attachment.url}
                alt={attachment.name}
                draggable={false}
                className={`w-full h-full rounded-[10px] object-cover transition-transform duration-300 ease-out ${
                    status !== "sending" && "group-hover:scale-[1.03]"
                }`}
            />
            {status != "sending" && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
            )}
        </button>
    );
};

export default ImageAttachment;
