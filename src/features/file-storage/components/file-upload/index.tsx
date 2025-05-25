import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import {UploadFile} from "../../types/upload-file.ts";
import {useParams} from "react-router";

interface FileUploadProps {
    setLoading?: (loading: boolean) => void;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onUpload?: () => void
}

export function FileUpload({ setLoading, onSuccess, onError, onUpload }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    const { folderId } = useParams();

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

        const uploadData: UploadFile = {
            file,
            directoryId: folderId || undefined,
        };

        try {
            const response = await FileStorageApiClient.uploadFile(uploadData);
            const fileId = response.fileId;
            onSuccess?.(fileId);
            showAlert("success", "File uploaded successfully!");
            setMessage("File uploaded successfully!");
            setFile(null);
            onUpload();
        } catch (error) {
            setMessage("File upload failed. Please try again.");
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
            <h2 className="text-xl font-semibold text-white">Upload File</h2>

            <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />

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
                    {isDragOver ? "Drop the file here" : "Click or drag a file here to upload"}
                </span>
            </label>

            {file && (
                <p className="text-sm text-gray-300 text-center truncate">
                    Selected file: <span className="font-medium">{file.name}</span>
                </p>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={uploading || !file}>
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </div>

            {message && (
                <p className="text-sm text-gray-400 text-center">{message}</p>
            )}
        </form>
    );
}