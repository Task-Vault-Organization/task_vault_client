import {FC, useEffect, useState} from "react";
import {FileStorageApiClient} from "../../../../api/clients/file-storage-api-client.ts";
import {GetFile} from "../../types/get-file.ts";
import {FileListComponent} from "../../components/file-list";

export const MyFilesPage : FC = () => {
    const [files, setFiles] = useState<GetFile[]>([]);

    useEffect(() => {
        async function fetchFiles() {
            const data = await FileStorageApiClient.getUploadedFiles();
            console.log(data)
            setFiles(data.files);
        }
        fetchFiles().then(r => console.log());
    }, []);

    return files && (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Files</h2>
            <FileListComponent files={files} />
        </div>
    );
}