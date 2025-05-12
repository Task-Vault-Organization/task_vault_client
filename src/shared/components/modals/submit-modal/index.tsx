import { FC, useState } from "react";
import {BaseModal} from "../base-modal";
import { Button } from "../../reusable/buttons/button";
import {FileUpload} from "../../../../features/file-storage/components/file-upload";
import {GetFile} from "../../../../features/file-storage/types/get-file.ts";
import {FileItem} from "../../../../features/file-storage/components/file-item";

interface Props {
    onClose: () => void;
    itemTitle: string;
    taskItemId: string;
    files: GetFile[];
    onSubmitSuccess: (taskItemId: string, fileId: string) => void;
}

export const SubmitPopup: FC<Props> = ({ onClose, itemTitle, taskItemId, files, onSubmitSuccess }) => {
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!selectedFileId) {
            alert("Please select a file before submitting.");
            return;
        }
        onSubmitSuccess(taskItemId, selectedFileId);
        onClose();
    };

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title={`Submit Answer – ${itemTitle}`}
            footer={
                <>
                    <Button onClick={onClose} variant="secondary" className="bg-gray-600 hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Submit
                    </Button>
                </>
            }
        >
            <p className="text-gray-300 mb-4">Double-click a file below to select it for this task item.</p>

            <div className="max-h-64 overflow-y-auto">
                {files?.length > 0 ? (
                    <div className="space-y-2">
                        {files.map(file => (
                            <div
                                key={file.id}
                                className={`rounded-lg p-3 border transition cursor-pointer ${
                                    selectedFileId === file.id
                                        ? "border-blue-400 bg-blue-900/20"
                                        : "border-gray-600 hover:border-white"
                                }`}
                                onClick={() => setSelectedFileId(file.id)}
                            >
                                <FileItem file={file} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No uploaded files available. Please upload a file first.</p>
                )}
            </div>
        </BaseModal>
    );
};