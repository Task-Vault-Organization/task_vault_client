import { FC, useEffect, useState } from "react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { GetFile } from "../../types/get-file.ts";
import { FileListComponent } from "../../components/file-list";
import { FileUploadToggle } from "../../../../shared/components/reusable/files/file-upload-toggle";

export const MyFilesPage: FC = () => {
    const [files, setFiles] = useState<GetFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFiles = async () => {
            const data = await FileStorageApiClient.getUploadedFiles();
            setFiles(data.files);
        };

        if (loading) {
            fetchFiles().finally(() => setLoading(false));
        }
    }, [loading]);

    return (
        <div className="mx-auto space-y-6 mb-10 container">
            <h2 className="text-2xl font-semibold text-center text-white">My Files</h2>
            <div className="flex flex-col items-center space-y-4">
                <FileUploadToggle setLoading={setLoading} />
                <FileListComponent files={files} setFiles={setFiles} />
            </div>
        </div>
    );
};