import {FC, useState} from "react";
import { GetFile } from "../../types/get-file.ts";
import { FileIcon, defaultStyles } from 'react-file-icon';
import { FiDownload, FiShare2, FiMoreVertical } from 'react-icons/fi';
import {getFileExtension} from "../../../../shared/helpers/file-helpers.ts";
import {FileViewerModal} from "../../../../shared/components/modals/file-viewer-modal";

interface FileItemProps {
    file: GetFile;
}

export const FileItem: FC<FileItemProps> = ({ file }) => {

    const [open, setOpen] = useState<boolean>(false);

    const fileExtension = getFileExtension(file.name);
    const formattedDate = new Date(file.uploadedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    return (
        <div
            onDoubleClick={() => setOpen(true)}
            className="py-4 px-4 group flex items-center gap-6 text-white bg-accent-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 cursor-pointer transition-all duration-1000 ease-in-out">
            <div className="w-10 h-10 mb-2">
                <FileIcon
                    extension={fileExtension}
                    {...defaultStyles[fileExtension as keyof typeof defaultStyles]}
                    radius={6}
                />
            </div>

            <div className="flex-grow min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-400 group-hover:text-gray-200">
                    <span>{formattedSize}</span>
                    <span>•</span>
                    <span className="truncate">{file.uploader?.email || "Unknown"}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-2 text-gray-200 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <FiDownload size={18} />
                </button>
                <button className="p-2 text-gray-200 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <FiShare2 size={18} />
                </button>
                <button className="p-2 text-gray-200 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <FiMoreVertical size={18} />
                </button>
            </div>
            <FileViewerModal open={open} setOpen={setOpen} fileId={file.id} fileType={file.fileType?.extension} />
        </div>
    );
};