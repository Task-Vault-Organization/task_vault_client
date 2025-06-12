import { FC, useEffect, useState } from "react";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { GetFile } from "../../../../features/file-storage/types/get-file";
import { FileIcon, defaultStyles } from "react-file-icon";
import { GetAssignedTaskItem } from "../../../../features/tasks/types/get-assigned-task-item";
import { OutlineButton } from "../../reusable/buttons/outline-button";

interface SelectExistingFileModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    taskItem: GetAssignedTaskItem;
    onFileSelect: (itemId: string, file: GetFile) => void;
}

export const SelectExistingFileModal: FC<SelectExistingFileModalProps> = ({
                                                                              open,
                                                                              setOpen,
                                                                              taskItem,
                                                                              onFileSelect
                                                                          }) => {
    const [files, setFiles] = useState<GetFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            if (!taskItem.fileTypeId) return;
            setLoading(true);
            try {
                const res = await FileStorageApiClient.getFilesByType(String(taskItem.fileTypeId));
                setFiles(res.files || []);
            } catch {
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            setSelectedFileId(null);
            fetchFiles();
        }
    }, [open, taskItem]);

    const handleConfirm = () => {
        const file = files.find(f => f.id === selectedFileId);
        if (file) {
            onFileSelect(taskItem.id, file);
            setOpen(false);
        }
    };

    return (
        <BaseModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Select Existing File"
            contentClassName="bg-accent-1 text-white"
            footer={
                <div className="w-full flex justify-end gap-3">
                    <OutlineButton onClick={() => setOpen(false)} className="text-white border-gray-500">
                        Cancel
                    </OutlineButton>
                    <Button onClick={handleConfirm} disabled={!selectedFileId}>
                        Use This File
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{taskItem.title}</h2>
                    <p className="text-gray-300 text-sm">{taskItem.description || "No description provided."}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="px-2 py-1 rounded bg-blue-900 border border-blue-600 text-blue-300">
                            Type: {taskItem.fileType?.name} ({taskItem.fileType?.extension})
                        </span>
                        <span className="px-2 py-1 rounded bg-green-900 border border-green-600 text-green-300">
                            Category: {taskItem.fileCategory?.name}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading files...</div>
                ) : files.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No available files of this type.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scroll">
                        {files.map(file => {
                            const ext = file.name.split(".").pop() || "";
                            const isSelected = selectedFileId === file.id;

                            return (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedFileId(file.id)}
                                    className={`cursor-pointer border rounded-xl p-4 flex items-center space-x-4 transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-900/30"
                                            : "border-gray-700 hover:border-gray-500"
                                    }`}
                                >
                                    <div className="w-10 h-10">
                                        <FileIcon extension={ext} {...defaultStyles[ext]} radius={4} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-gray-100">{file.name}</p>
                                        <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </BaseModal>
    );
};