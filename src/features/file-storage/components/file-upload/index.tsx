import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import { UploadFile } from "../../types/upload-file.ts";
import { useParams } from "react-router";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";

interface FileUploadProps {
    setLoading?: (loading: boolean) => void;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onUpload?: () => void;
}

export function FileUpload({ onSuccess, onError, onUpload }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { folderId } = useParams();
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files).slice(0, 5);
            setFiles(selectedFiles);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(event.dataTransfer.files).slice(0, 5);
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles);
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
        if (files.length === 0) {
            return;
        }

        setUploading(true);

        const uploadData: UploadFile = {
            files,
            directoryId: folderId !== "root" ? folderId : user.rootDirectoryId,
        };

        try {
            await FileStorageApiClient.uploadFile(uploadData);
            onSuccess?.();
            showAlert("success", "Files uploaded successfully!");
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            onUpload?.();
        } catch (error) {
            onError?.(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleUpload();
            }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl space-y-6 shadow-2xl w-full mx-auto"
        >
            <h2 className="text-xl font-semibold text-white">Upload Files</h2>

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
                accept="*"
            />

            <label
                htmlFor="file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl w-full text-center transition-all duration-200
                    ${isDragOver ? "border-blue-400 bg-blue-900/20 scale-105" : "border-gray-600"}
                `}
            >
                <UploadCloud className="w-10 h-10 text-gray-300" />
                <span className="mt-2 text-gray-300">
                    {isDragOver ? "Drop the files here" : "Click or drag up to 5 files here to upload"}
                </span>
            </label>

            {files.length > 0 && (
                <ul className="text-sm text-gray-300 text-center space-y-1 max-h-32 overflow-y-auto">
                    {files.map((file, index) => (
                        <li key={index} className="truncate">{file.name}</li>
                    ))}
                </ul>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={uploading || files.length === 0} loading={uploading}>
                    Upload
                </Button>
            </div>
        </form>
    );
}