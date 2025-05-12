import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { Button } from "../../../../shared/components/reusable/buttons/button";

interface FileUploadProps {
    setLoading?: (loading: boolean) => void;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    className?: string;
}

export function FileUpload({ setLoading, onSuccess, onError, className = "" }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            setFile(droppedFiles[0]);
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
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setMessage("");
        setLoading?.(true);

        try {
            const response = await FileStorageApiClient.uploadFile(file);
            const fileId = response.fileId;
            onSuccess?.(fileId);
            setMessage("File uploaded successfully!");
            showAlert("success", "File uploaded successfully!");
            setFile(null);
        } catch (error) {
            setMessage("File upload failed. Please try again.");
            onError?.(error);
        } finally {
            setUploading(false);
            setLoading?.(false);
        }
    };

    return (
        <div className={`w-full flex flex-col items-center gap-5 px-6 py-6 text-white dark:border dark:border-gray-700 rounded-lg shadow-md bg-accent-2 ${className}`}>
            <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label
                htmlFor="file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer flex flex-col items-center p-4 border-2 border-dashed rounded-xl w-full text-center transition-all duration-200 ${
                    isDragOver ? "border-blue-400 bg-blue-900/20 scale-105" : "border-gray-400"
                }`}
            >
                <UploadCloud className="w-10 h-10 text-gray-200" />
                <span className="mt-2 text-gray-200">
                    {isDragOver ? "Drop the file here" : "Click or drag a file here to upload"}
                </span>
            </label>

            {file && (
                <p className="text-sm text-gray-200 truncate w-full text-center">Selected file: {file.name}</p>
            )}

            <Button onClick={handleUpload} disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload File"}
            </Button>

            {message && <p className="text-sm text-gray-200 text-center">{message}</p>}
        </div>
    );
}