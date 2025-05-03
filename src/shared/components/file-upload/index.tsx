import { useState } from "react";
import { UploadCloud } from "lucide-react";
import {FileStorageApiClient} from "../../../api/clients/file-storage-api-client.ts";
import {showAlert} from "../../helpers/alerts-helpers.ts";

export function FileUpload({ setLoading }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            await FileStorageApiClient.uploadFile(file);
            setMessage("File uploaded successfully!");
            showAlert('success', "File uploaded successfully!")
            setFile(null);
            console.log('intra')
            setLoading(true);
        } catch (error) {
            setMessage("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 border rounded-2xl shadow-md w-full max-w-md bg-white">
            <input type="file" onChange={handleFileChange} className="mb-4 hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center p-4 border-2 border-dashed rounded-xl w-full text-center">
                <UploadCloud className="w-10 h-10 text-gray-500" />
                <span className="mt-2 text-gray-600">Click to select a file</span>
            </label>
            {file && <p className="mt-2 text-sm text-gray-700">Selected file: {file.name}</p>}
            <button onClick={handleUpload} disabled={uploading} className="mt-4">
                {uploading ? "Uploading..." : "Upload File"}
            </button>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
