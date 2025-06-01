import React, { FC, useState, useRef, useEffect } from "react";
import { GetFile } from "../../types/get-file.ts";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FiDownload, FiShare2, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaFolder, FaHistory, FaShareAlt, FaCrown } from "react-icons/fa";
import { getFileExtension } from "../../../../shared/helpers/file-helpers.ts";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router";
import { useDirectoriesStore } from "../../../../shared/stores/directories-store.ts";
import { AreYouSureModal } from "../../../../shared/components/modals/are-you-sure-modal";
import { FileHistoryModal } from "../../../../shared/components/modals/file-history-modal";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { FileSharingModal } from "../../../../shared/components/modals/file-sharing-modal";
import { UsersList } from "../../../../shared/components/reusable/users/users-list";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";

interface FileItemProps {
    file: GetFile;
    setLoading?: (loading: boolean) => void;
    fetchFiles?: () => Promise<void>;
    files: GetFile[];
    setFiles: (files: GetFile[]) => void;
}

export const FileItem: FC<FileItemProps> = ({ file, setLoading, fetchFiles, files, setFiles }) => {
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [fileSharingModalOpen, setFileSharingModalOpen] = useState(false);
    const [fileSharingFileId, setFileSharingFileId] = useState<string>("");
    const isDirectory = file.isDirectory;
    const fileExtension = isDirectory ? "" : getFileExtension(file.name);
    const baseName = isDirectory ? file.name : file.name.replace(/\.[^/.]+$/, "");
    const [editedName, setEditedName] = useState(baseName);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const { show } = useContextMenu({ id: `file-menu-${file.id}` });
    const navigate = useNavigate();
    const { push } = useDirectoriesStore();
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        if (spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
        }
    }, [editedName]);

    const isUploader = file.uploaderId === user.id;
    const isSharedWithMe = file.owners?.length > 1;

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        show({ event: e, props: { file } });
    };

    const handleItemClick = async ({ id }: any) => {
        switch (id) {
            case "update":
                if (file.owners?.some(owner => owner.id === user.id)) {
                    setIsEditing(true);
                }
                break;
            case "delete":
                setConfirmDeleteOpen(true);
                break;
            case "history":
                setHistoryOpen(true);
                break;
            case "download":
                await handleDownload();
                break;
            case "share":
                handleShareButtonClick(file.id);
                break;
        }
    };

    const handleDownload = async () => {
        try {
            const response = await FileStorageApiClient.downloadFile(file.id);
            let blob = response instanceof Blob ? response : new Blob([response], { type: file.fileType?.extension });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const deleteFile = async () => {
        try {
            if (setLoading) setLoading(true);
            await FileStorageApiClient.deleteFile(file.id);
            if (fetchFiles) await fetchFiles();
            showAlert("success", "Successfully deleted item");
        } catch (err) {
            console.error("Delete failed", err);
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

    const applyRename = async () => {
        const finalName = isDirectory ? editedName : `${editedName}${fileExtension ? `.${fileExtension}` : ""}`;
        if (finalName !== file.name) {
            try {
                const res = await FileStorageApiClient.renameFile({ fileId: file.id, name: finalName });
                showAlert("success", res.message);
                const newFiles = files.map((f) => f.id === file.id ? { ...f, name: res.renamedFile?.name || finalName } : f);
                setFiles(newFiles);
            } catch (err) {
                console.error("Rename failed", err);
            }
        }
        setIsEditing(false);
    };

    const handleRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") await applyRename();
    };

    const handleBlur = async () => {
        await applyRename();
    };

    const formattedDate = new Date(file.uploadedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const formattedSize =
        file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

    const handleShareButtonClick = (fileId: string) => {
        setFileSharingFileId(fileId);
        setFileSharingModalOpen(true);
    };

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
                onDoubleClick={handleDoubleClick}
                className={`${isSharedWithMe ? "bg-blue-900/60" : "dark:bg-accent-1"} py-4 px-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-lg transition-colors duration-200 cursor-pointer bg-blue-50 hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-700`}
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
                    {isEditing ? (
                        <div className="inline-flex items-center gap-1 relative">
                            <input
                                ref={inputRef}
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onKeyDown={handleRename}
                                onBlur={handleBlur}
                                className="font-mediumpx-1text-center sm:text-left whitespace-nowrap overflow-visible"
                                style={{ minWidth: "1ch" }}
                            />
                            <span ref={spanRef} className="absolute invisible whitespace-pre font-medium px-1 py-0.5">
                                {editedName || " "}
                            </span>
                        </div>
                    ) : (
                        <p className="font-medium truncate flex items-center justify-center sm:justify-start gap-3">
                            {file.name}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formattedSize}</span>
                        <span>•</span>
                        <span className="truncate">{file.uploader?.email || "Unknown"}</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    {isSharedWithMe && <FaShareAlt className="text-white" title="Shared file" />}
                    {isSharedWithMe && file.owners && (
                        <div className="relative">
                            <UsersList users={file.owners} userRemovable={false} />
                        </div>
                    )}
                </div>
            </div>

            <Menu id={`file-menu-${file.id}`} style={{ backgroundColor: "#3E5879" }}>
                {file.uploaderId === user.id && (
                    <Item id="update" onClick={handleItemClick}>
                        <FiEdit2 className="inline mr-2" style={{ color: "#fff", fontSize: ".9em" }} />
                        <span style={{ color: "#fff", fontSize: ".9em" }}>Rename</span>
                    </Item>
                )}
                <Item id="delete" onClick={handleItemClick}>
                    <FiTrash2 className="inline mr-2" style={{ color: "#fff", fontSize: ".9em" }} />
                    <span style={{ color: "#fff", fontSize: ".9em" }}>
                        {
                            file.uploaderId === user.id ?
                                "Delete" :
                                "Remove shared file"
                        }
                    </span>
                </Item>

                <Item id="download" onClick={handleItemClick}>
                    <FiDownload className="inline mr-2" style={{ color: "#fff", fontSize: ".9em" }} />
                    <span style={{ color: "#fff", fontSize: ".9em" }}>Download</span>
                </Item>
                <Item id="share" onClick={handleItemClick}>
                    <FiShare2 className="inline mr-2" style={{ color: "#fff", fontSize: ".9em" }} />
                    <span style={{ color: "#fff", fontSize: ".9em" }}>Share</span>
                </Item>
                <Item id="history" onClick={handleItemClick}>
                    <FaHistory className="inline mr-2" style={{ color: "#fff", fontSize: ".9em" }} />
                    <span style={{ color: "#fff", fontSize: ".9em" }}>Show History</span>
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

            <AreYouSureModal
                isOpen={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={deleteFile}
                title="Delete File"
                message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
            />

            <FileHistoryModal open={historyOpen} setOpen={setHistoryOpen} fileId={file.id} />

            <FileSharingModal open={fileSharingModalOpen} setOpen={setFileSharingModalOpen} fileId={fileSharingFileId} />
        </>
    );
};