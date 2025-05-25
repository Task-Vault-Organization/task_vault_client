import { FC, useState } from "react";
import { GetFile } from "../../types/get-file.ts";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FiDownload, FiShare2, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaFolder } from "react-icons/fa";
import { getFileExtension } from "../../../../shared/helpers/file-helpers.ts";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { FaHistory } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router";
import {useDirectoriesStore} from "../../../../shared/stores/directories-store.ts";

interface FileItemProps {
    file: GetFile;
}

const getMimeType = (extension?: string) => {
    if (!extension) return "application/octet-stream";
    const types: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        pdf: "application/pdf",
        txt: "text/plain",
        json: "application/json",
        csv: "text/csv",
        doc: "application/msword",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return types[extension.toLowerCase()] || "application/octet-stream";
};

export const FileItem: FC<FileItemProps> = ({ file }) => {
    const [open, setOpen] = useState(false);
    const { show } = useContextMenu({ id: `file-menu-${file.id}` });
    const navigate = useNavigate();

    const { push } = useDirectoriesStore();

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        show({ event: e, props: { file } });
    };

    const handleItemClick = ({ id, props }: any) => {
        const { file } = props;
        switch (id) {
            case "update":
                console.log("Updating", file.name);
                break;
            case "delete":
                console.log("Deleting", file.name);
                break;
            case "history":
                console.log("History for", file.name);
                break;
            case "details":
                console.log("Details for", file.name);
                break;
        }
    };

    const handleDownload = async () => {
        try {
            const response = await FileStorageApiClient.downloadFile(file.id);
            const blob = new Blob([response], { type: getMimeType(file.fileType?.extension) });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleDoubleClick = () => {
        if (file.isDirectory) {
            navigate(`/files/${file.id}`);
            push(file.id, file.name);
        } else {
            setOpen(true);
        }
    };

    const fileExtension = getFileExtension(file.name);
    const formattedDate = new Date(file.uploadedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const formattedSize =
        file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

    const isDirectory = file.isDirectory;

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
                onDoubleClick={handleDoubleClick}
                className={`py-4 px-4 group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-lg transition-colors duration-200 cursor-pointer border dark:border-gray-700 ${
                    isDirectory
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        : "bg-white hover:bg-blue-50 dark:bg-accent-1 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                }`}
            >
                <div className="w-10 h-10 flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                    {isDirectory ? (
                        <FaFolder size={28} className="text-gray-500 dark:text-gray-300" />
                    ) : (
                        <FileIcon
                            extension={fileExtension}
                            {...defaultStyles[fileExtension as keyof typeof defaultStyles]}
                            radius={6}
                        />
                    )}
                </div>

                <div className="flex-grow min-w-0 text-center sm:text-left">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formattedSize}</span>
                        <span>•</span>
                        <span className="truncate">{file.uploader?.email || "Unknown"}</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="flex justify-center sm:justify-end gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-full dark:text-gray-300 dark:hover:text-blue-400"
                        title="Download"
                    >
                        <FiDownload size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-full dark:text-gray-300 dark:hover:text-blue-400">
                        <FiShare2 size={18} />
                    </button>
                </div>
            </div>

            <Menu id={`file-menu-${file.id}`} style={{ backgroundColor: "#3E5879" }}>
                <Item id="update" onClick={handleItemClick}>
                    <FiEdit2 className="inline mr-2" style={{ color: "#fff", fontSize: '.9em' }} />
                    <span style={{ color: "#fff", fontSize: '.9em' }}>Update</span>
                </Item>
                <Item id="delete" onClick={handleItemClick}>
                    <FiTrash2 className="inline mr-2" style={{ color: "#fff", fontSize: '.9em' }} />
                    <span style={{ color: "#fff", fontSize: '.9em' }}>Delete</span>
                </Item>
                <Item id="history" onClick={handleItemClick}>
                    <FaHistory className="inline mr-2" style={{ color: "#fff", fontSize: '.9em' }} />
                    <span style={{ color: "#fff",fontSize: '.9em' }}>Show History</span>
                </Item>
                <Item id="details" onClick={handleItemClick}>
                    <TbListDetails className="inline mr-2" style={{ color: "#fff", fontSize: '.9em' }} />
                    <span style={{ color: "#fff", fontSize: '.9em' }}>Show Details</span>
                </Item>
            </Menu>

            {!isDirectory && (
                <FileViewerModal
                    open={open}
                    setOpen={setOpen}
                    fileId={file.id}
                    fileType={file.fileType?.extension || getFileExtension(file.name)}
                    fileName={file.name}
                />
            )}
        </>
    );
};