import { FC, useEffect, useState } from "react";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { GetFile } from "../../types/get-file.ts";
import { FileListComponent } from "../../components/file-list";
import { ToolbarToggle } from "../../../../shared/components/reusable/files/toolbar-toggle";
import { FileUpload } from "../../components/file-upload";
import { FolderCreate } from "../../components/folder-create";
import { Breadcrumbs } from "../../../../shared/components/reusable/bread-crumbs";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import { EmptyCollectionPlaceholder } from "../../../../shared/components/reusable/empty-collection-placeholder";
import { ImFilesEmpty } from "react-icons/im";
import { useDirectoriesStore } from "../../../../shared/stores/directories-store.ts";
import { useParams } from "react-router";

export const MyFilesPage: FC = () => {
    const [files, setFiles] = useState<GetFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { folderId } = useParams();
    const { goTo } = useDirectoriesStore();

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const data = folderId !== "root"
                ? await FileStorageApiClient.getUploadedDirectoryFiles(folderId)
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
        const isRoot = folderId === "root";
        const rootDirectory = { id: "root", name: "root" };
        if (isRoot) {
            useDirectoriesStore.setState({ directoriesStack: [rootDirectory] });
        } else {
            goTo(folderId);
        }
    }, [folderId]);

    const handleCreateFolder = async () => {
        await fetchFiles();
    };

    const handleUpload = async () => {
        await fetchFiles();
    };

    return (
        <div className="mx-auto space-y-6 mb-10 container">
            <h2 className="text-2xl font-semibold text-center text-white">My Files</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : files.length === 0 && folderId === "root" ? (
                <EmptyCollectionPlaceholder
                    icon={<ImFilesEmpty />}
                    text={"No files added"}
                    subtext={"Use the toolbar below to add files or folders"}
                />
            ) : (
                <>
                    <Breadcrumbs />
                    <div className="flex flex-col items-center space-y-4 w-full">
                        <FileListComponent files={files} setFiles={setFiles} setLoading={setLoading} fetchFiles={fetchFiles} />
                    </div>
                </>
            )}
            <ToolbarToggle
                setLoading={setLoading}
                uploadContent={<FileUpload onUpload={handleUpload} setLoading={setLoading} />}
                createFolderContent={<FolderCreate onCreate={handleCreateFolder} />}
            />
        </div>
    );
};