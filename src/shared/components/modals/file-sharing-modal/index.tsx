import { FC, useEffect, useState } from "react";
import { BaseModal } from "../base-modal";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store";
import { AuthenticationState } from "../../../../features/authentication/types/authentication-state";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { GetFile } from "../../../../features/file-storage/types/get-file";
import { GetFileShareDataUserItem } from "../../../../features/file-storage/types/get-file-share-data-user-item";
import { CreateOrUpdateFileShareRequest } from "../../../../features/file-storage/types/create-or-update-file-share-request";
import { FiCheck, FiClock, FiX, FiTrash2, FiPlus } from "react-icons/fi";
import { FormField } from "../../forms/form-field";
import { showAlert } from "../../../helpers/alerts-helpers";
import { CustomBgButton } from "../../reusable/buttons/custom-bg-button";

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
    const [emailInputs, setEmailInputs] = useState<string[]>([""]);
    const [loadingShare, setLoadingShare] = useState(false);

    const isUploader = file?.uploaderId === user.id;

    useEffect(() => {
        if (open) fetchFileDetails();
    }, [open]);

    useEffect(() => {
        if (open && isUploader && file) fetchFileShareData();
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

    const handleEmailChange = (index: number, value: string) => {
        const updated = [...emailInputs];
        updated[index] = value;
        setEmailInputs(updated);
    };

    const handleAddEmailInput = () => {
        setEmailInputs([...emailInputs, ""]);
    };

    const handleRemoveEmailInput = (index: number) => {
        setEmailInputs(emailInputs.filter((_, i) => i !== index));
    };

    const handleShare = async () => {
        const cleanedEmails = emailInputs
            .map((email) => email.trim().toLowerCase())
            .filter((email) => email);

        const existingEmails = fileShareData
            .filter((item) => item.status == null || item.status.id === 1 || item.status.id === 2)
            .map((item) => item.userEmail.toLowerCase());

        const newEmails = Array.from(new Set(cleanedEmails)).filter(
            (email) => !existingEmails.includes(email)
        );

        if (newEmails.length === 0) return;

        const payload: CreateOrUpdateFileShareRequest = {
            toUsersEmails: newEmails,
            fileId,
        };

        try {
            setLoadingShare(true);
            const res = await FileStorageApiClient.createOrUpdateFileShareRequest(payload);
            showAlert("success", res.message || "File shared successfully.");
            setEmailInputs([""]);
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
        return fileShareData
            .filter((item) => item.status == null || item.status.id !== 2)
            .sort((a, b) => {
                const priority = (id?: number) => (id === 1 ? 0 : id === 3 ? 2 : 1);
                return priority(a.status?.id) - priority(b.status?.id);
            })
            .map((item, index) => {
                const isPending = item.status?.id === 1;
                const isDenied = item.status?.id === 3;
                const StatusIcon = isPending ? FiClock : isDenied ? FiX : FiCheck;
                const statusText = isPending ? "Pending" : isDenied ? "Denied" : "Shared";
                const baseColor = isPending
                    ? "bg-accent-2/50 text-white/30"
                    : isDenied
                        ? "bg-accent-2 text-white/30"
                        : "bg-accent-2 text-white";
                const overlay = isPending
                    ? "after:bg-gray-900/30"
                    : isDenied
                        ? "after:bg-red-700/20"
                        : "";

                return (
                    <div
                        key={index}
                        className={`relative flex items-center justify-between p-3 rounded-lg mb-2 ${baseColor} ${overlay} after:absolute after:inset-0 after:rounded-lg z-0`}
                    >
                        <div className="flex items-center gap-3 z-10">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${getColorFromEmail(item.userEmail)} text-sm font-medium`}
                            >
                                {item.userEmail[0].toUpperCase()}
                            </div>
                            <span>{item.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm z-10">
                            <StatusIcon className="w-4 h-4" />
                            <span>{statusText}</span>
                        </div>
                    </div>
                );
            });
    };

    const isFormValid = emailInputs.some((email) => {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) return false;
        return !fileShareData.some(
            (item) =>
                item.userEmail.toLowerCase() === trimmed &&
                (item.status?.id === 1 || item.status?.id === 2 || item.status == null)
        );
    });

    return (
        <BaseModal
            isOpen={open}
            onClose={() => {
                setOpen(false);
                setTimeout(() => setEmailInputs([""]), 500);
            }}
            title={<span className="text-xl font-semibold text-white">{file?.name || "Share File"}</span>}
            contentClassName="bg-accent-1 text-white"
            footer={null}
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
                        <div className="">
                            {emailInputs.map((email, idx) => {
                                const normalized = email.trim().toLowerCase();
                                const isDuplicate = normalized && emailInputs.filter(
                                    (e) => e.trim().toLowerCase() === normalized
                                ).length > 1;
                                const isAlreadyShared = normalized && fileShareData.some(
                                    (item) =>
                                        item.userEmail.toLowerCase() === normalized &&
                                        (item.status?.id === 1 || item.status?.id === 2 || item.status == null)
                                );
                                return (
                                    <div key={idx} className="flex gap-2 items-center w-full">
                                        <div className="flex-grow">
                                            <FormField
                                                value={email}
                                                setValue={(val) => handleEmailChange(idx, val)}
                                                labelText="Email"
                                                type="email"
                                                required
                                                error={
                                                    normalized && isDuplicate
                                                        ? { message: "Duplicate email" }
                                                        : isAlreadyShared
                                                            ? { message: "Already shared" }
                                                            : undefined
                                                }
                                            />
                                        </div>
                                        {emailInputs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEmailInput(idx)}
                                                className="text-red-400 hover:text-red-300 mt-2"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                onClick={handleAddEmailInput}
                                className="text-sm text-white hover:text-blue-300 flex items-center gap-1"
                            >
                                <FiPlus /> Add another email
                            </button>
                            <div className={"mt-2"}>
                                <CustomBgButton
                                    onClick={handleShare}
                                    fullWidth
                                    loading={loadingShare}
                                    disabled={!isFormValid}
                                    background={isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600/40 cursor-not-allowed"}
                                >
                                    Share
                                </CustomBgButton>
                            </div>

                        </div>
                    </div>
                    {fileShareData.some((item) => item.status == null || item.status.id !== 2) && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-3">Shared With</h3>
                            <div className="max-h-64 overflow-y-auto pr-1 space-y-2 custom-scroll">
                                {renderSharedUsers()}
                            </div>
                        </div>
                    )}
                </>
            )}
        </BaseModal>
    );
};