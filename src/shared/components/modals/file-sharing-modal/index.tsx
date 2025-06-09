import { FC, useEffect, useState } from "react";
import { OutlineButton } from "../../reusable/buttons/outline-button";
import { BaseModal } from "../base-modal";
import { UserSearchField } from "../../reusable/search/search-users";
import { UsersList } from "../../reusable/users/users-list";
import { GetUser } from "../../../types/get-user.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../../features/authentication/types/authentication-state.ts";
import { showAlert } from "../../../helpers/alerts-helpers.ts";
import { GetFileShareDataUserItem } from "../../../../features/file-storage/types/get-file-share-data-user-item.ts";
import { CreateOrUpdateFileShareRequest } from "../../../../features/file-storage/types/create-or-update-file-share-request.ts";
import { GetFile } from "../../../../features/file-storage/types/get-file.ts";
import { FiCheck, FiClock, FiX } from "react-icons/fi";

interface FileSharingModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    fileId: string;
}

export const FileSharingModal: FC<FileSharingModalProps> = ({
                                                                open,
                                                                setOpen,
                                                                fileId,
                                                            }) => {
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);
    const [file, setFile] = useState<GetFile | null>(null);
    const [fileShareData, setFileShareData] = useState<GetFileShareDataUserItem[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<GetUser[]>([]);
    const [loadingShare, setLoadingShare] = useState<boolean>(false);

    const isUploader = file?.uploaderId === user.id;

    useEffect(() => {
        if (open) {
            fetchFileDetails();
        }
    }, [open]);

    useEffect(() => {
        if (open && isUploader && file) {
            fetchFileShareData();
        }
    }, [file, isUploader, open]);

    const fetchFileDetails = async () => {
        try {
            const res = await FileStorageApiClient.getFile(fileId);
            setFile(res.file);
        } catch (err) {
            console.error("Failed to fetch file", err);
        }
    };

    const fetchFileShareData = async () => {
        try {
            const res = await FileStorageApiClient.getFileShareData(fileId);
            setFileShareData(res.items || []);
        } catch (err) {
            console.error("Failed to fetch share data", err);
        }
    };

    const handleUserSelect = (user: GetUser) => {
        const alreadyShared = fileShareData.some(
            (item) =>
                item.userId === user.id &&
                item.status &&
                (item.status.id === 1 || item.status.id === 2)
        );
        const alreadySelected = selectedUsers.some((u) => u.id === user.id);

        if (!alreadyShared && !alreadySelected) {
            setSelectedUsers((prev) => [...prev, user]);
        }
    };

    const handleUserDeselect = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    const handleShare = async () => {
        const newUserIds = selectedUsers.map((u) => u.id);
        const existingShareUserIds = fileShareData
            .filter((item) => item.status == null)
            .map((item) => item.userId);

        const allUserIds = Array.from(new Set([...newUserIds, ...existingShareUserIds]));

        if (allUserIds.length === 0) return;

        const payload: CreateOrUpdateFileShareRequest = {
            toUsers: allUserIds,
            fileId,
        };

        try {
            setLoadingShare(true);
            const res = await FileStorageApiClient.createOrUpdateFileShareRequest(payload);
            showAlert("success", res.message || "File shared successfully.");
            setSelectedUsers([]);
            fetchFileShareData();
        } catch (err) {
            console.error("Failed to share file", err);
        } finally {
            setLoadingShare(false);
        }
    };

    const getColorFromEmail = (email: string) => {
        const colors = [
            "bg-red-200 text-red-800",
            "bg-blue-200 text-blue-800",
            "bg-green-200 text-green-800",
            "bg-yellow-200 text-yellow-800",
            "bg-purple-200 text-purple-800",
            "bg-pink-200 text-pink-800",
            "bg-indigo-200 text-indigo-800",
        ];
        const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const renderSharedUsers = () => {
        return [...fileShareData]
            .filter((item) => item.status == null || item.status.id !== 2)
            .sort((a, b) => {
                const getPriority = (statusId?: number) =>
                    statusId === 1 ? 0 : statusId === 3 ? 2 : 1;
                return getPriority(a.status?.id) - getPriority(b.status?.id);
            })
            .map((item, index: number) => {
                const statusId = item.status?.id;
                const isPending = statusId === 1;
                const isDenied = statusId === 3;

                const baseColor = isPending
                    ? "bg-accent-2/50 text-white/30"
                    : isDenied
                        ? "bg-accent-2 text-white/30"
                        : "bg-accent-2 text-white";

                const overlayStyle = isPending
                    ? "after:absolute after:inset-0 after:bg-gray-900/30 after:bg-opacity-60 after:rounded-lg"
                    : isDenied
                        ? "after:absolute after:inset-0 after:bg-red-700/20 after:bg-opacity-60 after:rounded-lg"
                        : "";

                const statusText = isPending ? "Pending" : isDenied ? "Denied" : "Shared";
                const StatusIcon = isPending ? FiClock : isDenied ? FiX : FiCheck;

                return (
                    <div
                        key={index}
                        className={`relative flex items-center justify-between p-3 rounded-lg mb-2 ${baseColor} ${overlayStyle}`}
                    >
                        <div className="flex items-center gap-3 z-10">
                            <div
                                className={`flex ${(isDenied || isPending) && "opacity-30"} items-center justify-center w-8 h-8 rounded-full ${getColorFromEmail(item.userEmail)} text-sm font-medium`}
                            >
                                {item.userEmail.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span>{item.userEmail}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm z-10">
                            <StatusIcon className="w-4 h-4" aria-label={statusText} />
                            <span>{statusText}</span>
                        </div>
                    </div>
                );
            });
        };

    return (
        <BaseModal
            isOpen={open}
            onClose={() => {
                setOpen(false);
                setTimeout(() => {
                    setSelectedUsers([]);
                }, 500)
            }}
            title={file?.name || "File Share"}
            contentClassName="bg-accent-1 text-white"
            footer={
                <OutlineButton
                    onClick={() => setOpen(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
                >
                    Close
                </OutlineButton>
            }
        >
            {!file ? (
                <div className="text-sm text-gray-400">Loading file info...</div>
            ) : !isUploader ? (
                <div className="text-sm text-gray-300">
                    This file was shared with you by{" "}
                    <span className="font-semibold">{file.uploader?.email || "someone"}</span>.
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Search for users to share the file with</h3>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex-1">
                                <UserSearchField
                                    onUserSelect={handleUserSelect}
                                    onUserDeselect={handleUserDeselect}
                                    selectedUsers={selectedUsers}
                                    excludedUserIds={fileShareData
                                        .filter((item) => item.status && (item.status.id === 1 || item.status.id === 2))
                                        .map((item) => item.userId)}
                                    placeholder="Search users..."
                                />
                            </div>
                            <OutlineButton
                                onClick={handleShare}
                                disabled={selectedUsers.length === 0}
                                className={`sm:w-auto w-full ${
                                    selectedUsers.length === 0
                                        ? "bg-blue-600/50 text-white/50 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                                loading={loadingShare}
                            >
                                Share
                            </OutlineButton>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="mt-4">
                                <UsersList
                                    users={selectedUsers}
                                    onRemoveUser={handleUserDeselect}
                                    userRemovable={true}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-3">Shared With</h3>
                        <div className="max-h-64 overflow-y-auto pr-1 space-y-2 custom-scroll">
                        {renderSharedUsers()}
                        </div>
                    </div>
                </>
            )}
        </BaseModal>
    );
};