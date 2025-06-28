import { FC, useEffect } from "react";
import { FileListComponent } from "../../components/file-list";
import { ToolbarToggle } from "../../../../shared/components/reusable/files/toolbar-toggle";
import { FileUpload } from "../../components/file-upload";
import { FolderCreate } from "../../components/folder-create";
import { Breadcrumbs } from "../../../../shared/components/reusable/bread-crumbs";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import { EmptyCollectionPlaceholder } from "../../../../shared/components/reusable/empty-collection-placeholder";
import { ImFilesEmpty } from "react-icons/im";
import { FaLayerGroup, FaCloudUploadAlt, FaShareAlt, FaThLarge, FaTh, FaBars } from "react-icons/fa";
import { useDirectoriesStore } from "../../../../shared/stores/directories-store.ts";
import { useParams } from "react-router";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";
import {useFilesStore} from "../../stores/files-store.ts";
import {AiTool} from "../../components/ai-tool";

const VIEW_OPTIONS = [
    { key: "all", label: "All", icon: <FaLayerGroup className="mr-1" /> },
    { key: "uploaded", label: "Uploaded", icon: <FaCloudUploadAlt className="mr-1" /> },
    { key: "shared", label: "Shared with me", icon: <FaShareAlt className="mr-1" /> },
];

const DISPLAY_OPTIONS = [
    { key: "1", icon: <FaBars /> },
    { key: "2", icon: <FaThLarge /> },
    { key: "3", icon: <FaTh /> },
];

export const MyFilesPage: FC = () => {
    const {
        files,
        loading,
        viewType,
        displayMode,
        fetchFiles,
        setFiles,
        setLoading,
        setViewType,
        setDisplayMode,
    } = useFilesStore();

    const { folderId } = useParams();
    const { goTo } = useDirectoriesStore();
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);

    useEffect(() => {
        fetchFiles(folderId);
        const isRoot = folderId === "root";
        const rootDirectory = { id: "root", name: "root" };
        if (isRoot) {
            useDirectoriesStore.setState({ directoriesStack: [rootDirectory] });
        } else {
            goTo(folderId);
        }
    }, [folderId, viewType]);

    const handleCreateFolder = async () => {
        await fetchFiles(folderId);
    };

    const handleUpload = async () => {
        setViewType("uploaded");
        await fetchFiles(folderId);
    };

    const handleSubmitAiTool = async (folderId: string, categories: string[]) => {
        await fetchFiles(folderId);
    };

    return (
        <div className="mx-auto space-y-6 mb-10 container px-4 sm:px-10">
            <h2 className="text-2xl font-semibold text-center text-white">My Files</h2>

            <div className="border-b border-gray-800 py-2">
                <div className="flex justify-between items-center">
                    <div className="rounded-lg gap-2 flex shadow-inner text-white">
                        {VIEW_OPTIONS.map(({ key, label, icon }) => (
                            <button
                                key={key}
                                onClick={() => setViewType(key)}
                                className={`px-4 font-medium py-2 text-sm flex items-center rounded-lg transition-all duration-300 ${
                                    viewType === key ? "bg-accent-2 text-white" : "hover:bg-gray-700"
                                }`}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="rounded-lg flex space-x-1 p-1 shadow-inner text-white">
                        {DISPLAY_OPTIONS.map(({ key, icon }) => (
                            <button
                                key={key}
                                onClick={() => setDisplayMode(key)}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                    displayMode === key ? "bg-accent-2 text-white" : "hover:bg-gray-700"
                                }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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
                        <FileListComponent displayMode={displayMode} />
                    </div>
                </>
            )}

            <ToolbarToggle
                setLoading={setLoading}
                uploadContent={<FileUpload onUpload={handleUpload} setLoading={setLoading} />}
                createFolderContent={<FolderCreate onCreate={handleCreateFolder} />}
                aiToolContent={<AiTool  onSubmit={handleSubmitAiTool}/>}
            />
        </div>
    );
};