import { FC, useEffect, useState } from "react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { GetFile } from "../../types/get-file.ts";
import { FileListComponent } from "../../components/file-list";
import { ToolbarToggle } from "../../../../shared/components/reusable/files/toolbar-toggle";
import { useCurrentDirectoryName } from "../../../../shared/hooks/use-current-directory-name.ts";
import { FileUpload } from "../../components/file-upload";
import { FolderCreate } from "../../components/folder-create";
import { Breadcrumbs } from "../../../../shared/components/reusable/bread-crumbs";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";

export const MyFilesPage: FC = () => {
    const [files, setFiles] = useState<GetFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const currentDirectoryName = useCurrentDirectoryName();

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const data = currentDirectoryName !== "root"
                ? await FileStorageApiClient.getUploadedDirectoryFiles(currentDirectoryName)
                : await FileStorageApiClient.getUploadedDirectoryFiles("");
            setFiles(data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [currentDirectoryName]);

    const handleCreateFolder = async (folderName: string) => {
        await fetchFiles();
    };

    const handleUpload = async () => {
        await fetchFiles();
    };

    return (
        <div className="mx-auto space-y-6 mb-10 container">
            <h2 className="text-2xl font-semibold text-center text-white">My Files</h2>
            <Breadcrumbs />
            <div className="flex flex-col items-center space-y-4 w-full">
                <ToolbarToggle
                    setLoading={setLoading}
                    uploadContent={<FileUpload onUpload={handleUpload} setLoading={setLoading} />}
                    createFolderContent={<FolderCreate onCreate={handleCreateFolder} />}
                />
                {loading ? (
                    <Spinner />
                ) : (
                    <FileListComponent files={files} setFiles={setFiles} />
                )}
            </div>
        </div>
    );
};
