import { useRef, useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store.ts";
import { UsersApiClient } from "../../../../api/clients/user-api-client.ts";
import { AuthenticateApiClient } from "../../../../api/clients/authenticate-api-client.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { showAlert } from "../../../helpers/alerts-helpers.ts";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";
import { GetUserResponse } from "../../../types/get-user-response.ts";

interface UploadProfilePhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadProfilePhotoModal({ isOpen, onClose }: UploadProfilePhotoModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const user = useAuthenticationStore(state => state.user);
    const jwtToken = useAuthenticationStore(state => state.jwtToken);
    const authenticateUserStore = useAuthenticationStore(state => state.authenticateUserStore);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const previewUrlRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }

            if (selectedFile) {
                const url = URL.createObjectURL(selectedFile);
                previewUrlRef.current = url;
                if (isMounted) setPreviewUrl(url);
            } else if (user?.profilePhotoId) {
                try {
                    const response = await FileStorageApiClient.downloadFile(user.profilePhotoId);
                    const blob = new Blob([response]);
                    const url = URL.createObjectURL(blob);
                    previewUrlRef.current = url;
                    if (isMounted) setPreviewUrl(url);
                } catch {
                    if (isMounted) setPreviewUrl(null);
                }
            } else if (user?.googleProfilePhotoUrl) {
                if (isMounted) setPreviewUrl(user.googleProfilePhotoUrl);
            } else {
                if (isMounted) setPreviewUrl(null);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, [selectedFile, user?.profilePhotoId, user?.googleProfilePhotoUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            await UsersApiClient.uploadProfilePhoto(selectedFile);
            const resUser: GetUserResponse = await AuthenticateApiClient.getUser();
            if (resUser.user) {
                const { setUser } = useAuthenticationStore.getState();
                setUser(resUser.user);
            }
            showAlert("success", "Profile photo updated successfully.");
            setSelectedFile(null);
            onClose();
        } catch {
            showAlert("error", "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Upload Profile Photo" contentClassName="bg-accent-1 text-white">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}
                className="p-6 rounded-2xl space-y-6 w-full mx-auto"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-photo-upload"
                    accept="image/*"
                />

                <label
                    htmlFor="profile-photo-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl w-full text-center transition-all duration-200
                        ${isDragOver ? "border-blue-400 bg-blue-900/20 scale-105" : "border-gray-600"}
                    `}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="rounded-full w-40 h-40 object-cover" />
                    ) : (
                        <div className="rounded-full w-40 h-40 bg-gray-700 text-white flex items-center justify-center text-4xl uppercase">
                            {user?.email?.[0] ?? ""}
                        </div>
                    )}
                    <UploadCloud className="w-8 h-8 text-gray-300 mt-4" />
                    <span className="mt-2 text-gray-300">Click or drag an image file here to upload</span>
                </label>

                {selectedFile && (
                    <div className="text-sm text-gray-300 text-center truncate">{selectedFile.name}</div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={!selectedFile || uploading} loading={uploading}>
                        Upload
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
}