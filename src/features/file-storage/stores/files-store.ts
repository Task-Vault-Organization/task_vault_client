import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileStorageApiClient } from "../../../api/clients/file-storage-api-client.ts";
import {GetFile} from "../types/get-file.ts";
import {useAuthenticationStore} from "../../authentication/stores/authentication-store.ts";

interface FilesState {
    files: GetFile[];
    loading: boolean;
    viewType: string;
    displayMode: string;
    fetchFiles: (folderId?: string) => Promise<void>;
    setViewType: (type: string) => void;
    setDisplayMode: (mode: string) => void;
    setFiles: (files: GetFile[]) => void;
    setLoading: (loading: boolean) => void;
}

const VIEW_TYPE_KEY = "fileViewType";
const DISPLAY_MODE_KEY = "fileDisplayMode";

export const useFilesStore = create<FilesState>()(
    persist(
        (set, get) => ({
            files: [],
            loading: true,
            viewType: localStorage.getItem(VIEW_TYPE_KEY) || "all",
            displayMode: localStorage.getItem(DISPLAY_MODE_KEY) || "1",

            setFiles: (files) => set({ files }),
            setLoading: (loading) => set({ loading }),

            setViewType: (type) => {
                localStorage.setItem(VIEW_TYPE_KEY, type);
                set({ viewType: type });
            },

            setDisplayMode: (mode) => {
                localStorage.setItem(DISPLAY_MODE_KEY, mode);
                set({ displayMode: mode });
            },

            fetchFiles: async (folderId = "root") => {
                try {
                    set({ loading: true });
                    const user = useAuthenticationStore.getState().user;
                    const directoryId = folderId !== "root" ? folderId : user?.rootDirectoryId;
                    const { viewType } = get();

                    let data;
                    if (viewType === "uploaded") {
                        data = await FileStorageApiClient.getAllDirectoryUploadedFiles(directoryId);
                    } else if (viewType === "shared") {
                        data = await FileStorageApiClient.getAllDirectorySharedFiles(directoryId);
                    } else {
                        data = await FileStorageApiClient.getAllDirectoryFiles(directoryId);
                    }

                    set({ files: data.files });
                } catch (error) {
                    console.error("Error fetching files:", error);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        { name: "files-store" }
    )
);