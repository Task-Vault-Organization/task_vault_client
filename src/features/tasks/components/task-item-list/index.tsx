import { FC, useEffect, useState } from "react";
import { GetTaskItem } from "../../types/get-task-item.ts";
import { SubmitPopup } from "../../../../shared/components/modals/submit-modal";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";
import { GetUser } from "../../../../shared/types/get-user.ts";
import { GetTask } from "../../types/get-task.ts";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { GetFile } from "../../../file-storage/types/get-file.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";

interface Props {
    items: GetTaskItem[];
    canSubmit?: boolean;
    task: GetTask;
}

export const TaskItemList: FC<Props> = ({ items, canSubmit = false, task }) => {
    const [openPopupId, setOpenPopupId] = useState<string | null>(null);
    const user: GetUser = useAuthenticationStore((state: AuthenticationState) => state.user);
    const isOwner = user?.id === task.ownerId;
    const isAssigned = task.assignees?.some(a => a.id === user?.id);

    const [submittedFiles, setSubmittedFiles] = useState<Record<string, string>>({});
    const [userFiles, setUserFiles] = useState<GetFile[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await FileStorageApiClient.getUploadedFiles();
                setUserFiles(response.files);
            } catch (error) {
                console.error("Failed to load files:", error);
            }
        };

        fetchFiles();
    }, []);

    const handleSubmitSuccess = (taskItemId: string, fileId: string) => {
        setSubmittedFiles(prev => ({ ...prev, [taskItemId]: fileId }));
    };

    const handleFinalSubmission = async () => {
        const payload = {
            taskId: task.id,
            taskItemFiles: Object.entries(submittedFiles).map(([taskItemId, fileId]) => ({
                taskItemId,
                fileId
            }))
        };

        try {
            await TasksApiClient.createTaskSubmission(payload);
            showAlert("success", "Submission successful!");
        } catch (error) {
            showAlert("error", "Failed to submit your work.");
            console.error(error);
        }
    };

    if (items.length === 0) return <p className="text-gray-400 italic">No task items added.</p>;

    return (
        <div>
            <h3 className="text-xl font-semibold text-white mb-3">Task Items</h3>

            {isAssigned && canSubmit && (
                <p className="text-lg font-medium text-gray-400 mb-5">
                    Double-click a task item to add a submission.
                </p>
            )}

            <ul className="space-y-4">
                {items.map(item => {
                    const isClickable = canSubmit && isAssigned;
                    const hasSubmitted = submittedFiles[item.id];

                    return (
                        <li
                            key={item.id}
                            onDoubleClick={() => isClickable && setOpenPopupId(item.id)}
                            className={`relative p-5 rounded-xl border shadow-sm transition-all text-sm ${
                                isClickable
                                    ? hasSubmitted
                                        ? "bg-green-950 border-green-500 hover:border-white"
                                        : "bg-gradient-to-r from-accent-2 to-accent-3 border-accent-3 hover:border-white"
                                    : "bg-accent-2 border-accent-3"
                            } ${isClickable ? "cursor-pointer" : ""}`}
                            title={isClickable ? "Double-click to submit" : undefined}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                    <div className="text-lg text-white font-semibold">{item.title}</div>

                                    {item.description && (
                                        <p className="text-gray-300">{item.description}</p>
                                    )}

                                    {(item.fileType || item.fileCategory) && (
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            {item.fileType && (
                                                <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full border border-blue-700">
                                                    File Type: {item.fileType.name} ({item.fileType.extension})
                                                </span>
                                            )}
                                            {item.fileCategory && (
                                                <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full border border-green-700">
                                                    Category: {item.fileCategory.name}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {hasSubmitted && (
                                        <div className="mt-3 flex items-center gap-2 text-green-300 text-sm font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                                            </svg>
                                            <span>File selected</span>
                                        </div>
                                    )}
                                </div>

                                {isClickable && (
                                    <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-900 bg-opacity-30 px-2 py-1 rounded-md">
                                        <PencilSquareIcon className="w-4 h-4" />
                                        <span>Submit</span>
                                    </div>
                                )}
                            </div>

                            {openPopupId === item.id && (
                                <SubmitPopup
                                    onClose={() => setOpenPopupId(null)}
                                    itemTitle={item.title}
                                    taskItemId={item.id}
                                    files={userFiles}
                                    onSubmitSuccess={handleSubmitSuccess}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>

            {items.length === Object.keys(submittedFiles).length && (
                <div className="mt-6">
                    <button
                        onClick={handleFinalSubmission}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
                    >
                        ✅ Submit All Work
                    </button>
                </div>
            )}
        </div>
    );
};