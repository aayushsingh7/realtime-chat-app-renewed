import { FiDownload } from "react-icons/fi";
import type { IAttachment } from "../../../types/commonType";

interface ExtStyle {
    bg: string;
    text: string;
    label: string;
}

const EXT_COLORS: Record<string, ExtStyle> = {
    pdf: {bg: "bg-red-500/20", text: "text-red-400", label: "PDF"},
    doc: {bg: "bg-blue-500/20", text: "text-blue-400", label: "DOC"},
    docx: {bg: "bg-blue-500/20", text: "text-blue-400", label: "DOCX"},
    xls: {bg: "bg-emerald-500/20", text: "text-emerald-400", label: "XLS"},
    xlsx: {bg: "bg-emerald-500/20", text: "text-emerald-400", label: "XLSX"},
    ppt: {bg: "bg-orange-500/20", text: "text-orange-400", label: "PPT"},
    pptx: {bg: "bg-orange-500/20", text: "text-orange-400", label: "PPTX"},
    zip: {bg: "bg-yellow-500/20", text: "text-yellow-400", label: "ZIP"},
    rar: {bg: "bg-yellow-500/20", text: "text-yellow-400", label: "RAR"},
    txt: {bg: "bg-zinc-500/20", text: "text-zinc-400", label: "TXT"},
    mp3: {bg: "bg-pink-500/20", text: "text-pink-400", label: "MP3"},
    wav: {bg: "bg-pink-500/20", text: "text-pink-400", label: "WAV"},
};

function getExtStyle(ext: string): ExtStyle {
    return (
        EXT_COLORS[ext.toLowerCase()] ?? {
            bg: "bg-zinc-500/20",
            text: "text-zinc-400",
            label: ext.toUpperCase().slice(0, 5),
        }
    );
}

interface FileAttachmentProps {
    attachment: IAttachment;
    isSender: boolean;
}

const  FileAttachment:React.FC<FileAttachmentProps> = ({attachment, isSender})=> {
    console.log("document")
    const {name, size, extension, url} = attachment;
    const extStyle = getExtStyle(extension);
    const containerBg = isSender ? "bg-purple-900/10" : "bg-zinc-800";
    const borderColor = isSender ? "border-purple-600/50" : "border-zinc-700/60";
    const downloadBg = isSender
        ? "bg-purple-800/70 hover:bg-purple-700/80 text-purple-200 hover:text-white"
        : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white";

    return (
        <div className={`border-2 flex flex-col items-center gap-3 rounded-xl border min-w-[300px]  ${containerBg} ${borderColor}`}>
            <div className="flex justify-start w-full px-3 py-2.5">
                <div
                    className={`relative mr-3 flex-shrink-0 font-bold flex items-center justify-center w-11 h-11 rounded-lg ${extStyle.text} ${extStyle.bg}`}
                >
                    {extStyle.label}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-md font-medium truncate leading-tight">{name}</p>
                    <p className="text-zinc-400 text-sm font-bold mt-0.5">size: {size}</p>
                </div>
            </div>

            <a
                href={url}
                download={name}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className={`flex-shrink-0 flex items-center justify-center
                    w-8 h-10  transition-colors duration-150 w-full ${downloadBg}`}
                title="Download"
            >
                <FiDownload className="w-4 h-4 mr-2" />
                Download
            </a>
        </div>
    );
}

export default FileAttachment;  