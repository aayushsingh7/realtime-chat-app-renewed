import React, {useState, useRef, useEffect} from "react";
import {FiX, FiSmile, FiPlus} from "react-icons/fi";
import {IoSend} from "react-icons/io5";
import {HiOutlineDocument} from "react-icons/hi2";

interface AttachmentPanelProps {
    initialFiles?: File[];
    onClose: () => void;
    onSend: (files: File[], message: string) => void;
}

interface Attachment {
    id: string;
    file: File;
    previewUrl: string | null;
    type: "image" | "video" | "document";
}

export default function AttachmentPanel({initialFiles = [], onClose, onSend}: AttachmentPanelProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const processFiles = (files: FileList | File[]) => {
        const newAttachments: Attachment[] = Array.from(files).map((file) => {
            let type: "image" | "video" | "document" = "document";
            let previewUrl = null;

            if (file.type.startsWith("image/")) {
                type = "image";
                previewUrl = URL.createObjectURL(file);
            } else if (file.type.startsWith("video/")) {
                type = "video";
                previewUrl = URL.createObjectURL(file);
            }

            return {
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl,
                type,
            };
        });

        setAttachments((prev) => [...prev, ...newAttachments]);
        // If it's the first batch, select the first item
        if (attachments.length === 0 && newAttachments.length > 0) {
            setSelectedIndex(0);
        }
    };

    useEffect(() => {
        if (initialFiles.length > 0) {
            processFiles(initialFiles);
        }
        return () => {
            attachments.forEach((att) => {
                if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
            });
        };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            setSelectedIndex(attachments.length);
            e.target.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSend = () => {
        const filesToSend = attachments.map((a) => a.file);
        onSend(filesToSend, message);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const activeAttachment = attachments[selectedIndex];

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#1a1a1c] text-zinc-100 font-sans">
            <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <div className="flex items-center px-4 py-4 h-16 flex-shrink-0">
                <button
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                >
                    <FiX className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center font-medium text-zinc-200 truncate px-4">
                    {activeAttachment ? activeAttachment.file.name : "No file selected"}
                </div>
                <div className="w-10"></div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                {!activeAttachment ? (
                    <div className="text-zinc-500">Please attach a file</div>
                ) : activeAttachment.type === "image" && activeAttachment.previewUrl ? (
                    <img
                        src={activeAttachment.previewUrl}
                        alt={activeAttachment.file.name}
                        className="max-w-full max-h-full object-contain rounded-md"
                    />
                ) : activeAttachment.type === "video" && activeAttachment.previewUrl ? (
                    <video
                        src={activeAttachment.previewUrl}
                        controls
                        className="max-w-full max-h-full rounded-md shadow-lg"
                    />
                ) : (
                    <div className="bg-[#111921] w-full max-w-[400px] aspect-[4/3] rounded-xl flex flex-col items-center justify-center shadow-md">
                        <div className="bg-white rounded w-16 h-20 relative mb-6 shadow-sm flex items-center justify-center">
                            <div className="absolute top-0 right-0 border-t-[16px] border-l-[16px] border-t-[#111921] border-l-gray-200 shadow-sm" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-200 mb-2">No preview available</h3>
                        <p className="text-zinc-500 text-sm">
                            {formatFileSize(activeAttachment.file.size)} -{" "}
                            {activeAttachment.file.name.split(".").pop()?.toUpperCase() || "FILE"}
                        </p>
                    </div>
                )}
            </div>

            <div className="w-full max-w-3xl mx-auto px-4 pb-4">
                <div className="bg-[#2a2a2c] rounded-xl flex items-center px-4 py-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none"
                    />
                    <button className="text-zinc-400 hover:text-zinc-200 ml-2 focus:outline-none">
                        <FiSmile className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1c] border-t border-white/5 relative h-20">
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 overflow-x-auto max-w-[60%] scrollbar-none">
                    {attachments.map((att, index) => (
                        <button
                            key={att.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden transition-all ${
                                selectedIndex === index
                                    ? "border-2 border-[#25d366]"
                                    : "border border-transparent hover:border-zinc-600"
                            } bg-[#2a2a2c]`}
                        >
                            {att.type === "image" && att.previewUrl ? (
                                <img src={att.previewUrl} alt="" className="w-full h-full object-cover" />
                            ) : att.type === "video" ? (
                                <div className="text-xs font-bold text-zinc-400">VID</div>
                            ) : (
                                <div className="text-[10px] font-bold text-zinc-400 uppercase">
                                    {att.file.name.split(".").pop()?.substring(0, 4) || "DOC"}
                                </div>
                            )}
                        </button>
                    ))}

                    <button
                        onClick={triggerFileInput}
                        className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-[#2a2a2c] border border-transparent hover:border-zinc-600 text-zinc-300 transition-colors"
                        title="Add more files"
                    >
                        <FiPlus className="w-6 h-6" />
                    </button>
                </div>

                <div className="ml-auto">
                    <button
                        onClick={handleSend}
                        disabled={attachments.length === 0}
                        className="w-12 h-12 flex items-center justify-center bg-[#00a884] hover:bg-[#008f6f] disabled:bg-zinc-700 disabled:text-zinc-500 text-black rounded-full transition-colors focus:outline-none"
                    >
                        <IoSend className="w-5 h-5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
