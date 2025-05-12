import { FC, useState } from "react";
import { GetFile } from "../../types/get-file.ts";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FiDownload, FiShare2, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getFileExtension } from "../../../../shared/helpers/file-helpers.ts";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { FaHistory } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";

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

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
                onDoubleClick={() => setOpen(true)}
                className="py-4 px-4 group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-white bg-accent-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 cursor-pointer dark:border dark:border-gray-700"
            >
                <div className="w-10 h-10 flex-shrink-0 mx-auto sm:mx-0">
                    <FileIcon
                        extension={fileExtension}
                        {...defaultStyles[fileExtension as keyof typeof defaultStyles]}
                        radius={6}
                    />
                </div>

                <div className="flex-grow min-w-0 text-center sm:text-left">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 text-sm text-gray-400 group-hover:text-gray-200">
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
                        className="p-2 text-gray-200 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Download"
                    >
                        <FiDownload size={18} />
                    </button>
                    <button className="p-2 text-gray-200 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                        <FiShare2 size={18} />
                    </button>
                </div>
            </div>

            <Menu id={`file-menu-${file.id}`} style={{ backgroundColor: "#3E5879" }}>
                <Item
                    id="update"
                    onClick={handleItemClick}
                    style={{ backgroundColor: "#3E5879" }}
                >
                    <FiEdit2 className="inline mr-2" style={{ color: "#fff" }} />
                    <span style={{ color: "#fff" }}>Update</span>
                </Item>
                <Item
                    id="delete"
                    onClick={handleItemClick}
                    style={{ backgroundColor: "#3E5879", hover: "none" }}
                >
                    <FiTrash2 className="inline mr-2" style={{ color: "#fff" }} />
                    <span style={{ color: "#fff" }}>Delete</span>
                </Item>

                <Item
                    id="history"
                    onClick={handleItemClick}
                    style={{ backgroundColor: "#3E5879", hover: "none" }}
                >
                    <FaHistory className="inline mr-2" style={{ color: "#fff" }} />
                    <span style={{ color: "#fff" }}>Show History</span>
                </Item>

                <Item
                    id="details"
                    onClick={handleItemClick}
                    style={{ backgroundColor: "#3E5879", hover: "none" }}
                >
                    <TbListDetails className="inline mr-2" style={{ color: "#fff" }} />
                    <span style={{ color: "#fff" }}>Show Details</span>
                </Item>
            </Menu>

            <FileViewerModal
                open={open}
                setOpen={setOpen}
                fileId={file.id}
                fileType={file.fileType?.extension}
                fileName={file.name}
            />
        </>
    );
};