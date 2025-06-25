import { useRef, useState, useEffect } from "react";
import { useAuthenticationStore } from "../../../../features/authentication/stores/authentication-store.ts";
import { UsersApiClient } from "../../../../api/clients/user-api-client.ts";
import { AuthenticateApiClient } from "../../../../api/clients/authenticate-api-client.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { showAlert } from "../../../helpers/alerts-helpers.ts";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";
import {GetUserResponse} from "../../../types/get-user-response.ts";

interface UploadProfilePhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadProfilePhotoModal({ isOpen, onClose }: UploadProfilePhotoModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
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
        <BaseModal isOpen={isOpen} onClose={onClose} title="Upload Profile Photo">
            <div className="flex flex-col gap-4 items-center">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        className="rounded-full w-24 h-24 object-cover"
                        alt="Profile"
                    />
                ) : (
                    <div className="rounded-full w-24 h-24 bg-gray-700 text-white flex items-center justify-center text-xl uppercase">
                        {user?.email?.[0] ?? ""}
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                    Choose Photo
                </Button>
                {selectedFile && (
                    <div className="text-sm text-gray-300 text-center">{selectedFile.name}</div>
                )}
                <Button
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                    loading={uploading}
                >
                    Upload
                </Button>
            </div>
        </BaseModal>
    );
}