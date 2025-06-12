import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client";
import { GetAssignedTaskResponse } from "../../types/get-assigned-task-response";
import { FaTimesCircle, FaQuestionCircle, FaFolderOpen } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { GetAssignedTaskItem } from "../../types/get-assigned-task-item";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store";
import { AuthenticationState } from "../../../authentication/types/authentication-state";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { GetFile } from "../../../file-storage/types/get-file";
import { SelectExistingFileModal } from "../../../../shared/components/modals/select-existing-file-modal";
import { showAlert } from "../../../../shared/helpers/alerts-helpers";

export const AssignedTaskPage: FC = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<GetAssignedTaskResponse["task"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedComment, setExpandedComment] = useState<Record<string, boolean>>({});
    const [filesPerItem, setFilesPerItem] = useState<Record<string, File[]>>({});
    const [filePreview, setFilePreview] = useState<{ open: boolean; file: any | null }>({ open: false, file: null });
    const [selectFileModal, setSelectFileModal] = useState<boolean>(false);
    const [selectedTaskItem, setSelectedTaskItem] = useState<GetAssignedTaskItem | null>(null);
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);

    const fetchTask = async () => {
        setLoading(true);
        try {
            const response = await TasksApiClient.getAssignedTask(taskId as string);
            setTask(response.task);
        } catch {
            setError("Failed to fetch task.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (error || !task) return <div className="text-red-500 text-center mt-10">{error}</div>;

    const getApprovalStatus = () => {
        if (task.approved === true) return <span className="flex items-center gap-1 text-green-400"><BsCheckCircleFill /> Approved</span>;
        if (task.approved === false) return <span className="flex items-center gap-1 text-red-400"><FaTimesCircle /> Rejected</span>;
        return <span className="flex items-center gap-1 text-yellow-400"><FaQuestionCircle /> Pending</span>;
    };

    const handleFileChange = (itemId: string, files: File[]) => {
        setFilesPerItem(prev => ({ ...prev, [itemId]: files }));
    };

    const handleFileSelectFromModal = (itemId: string, file: GetFile) => {
        if (!task) return;
        const updatedItems = task.taskItems.map(item =>
            item.id === itemId ? { ...item, submittedFile: file } : item
        );
        setTask({ ...task, taskItems: updatedItems });
    };

    const handleSubmit = async () => {
        if (!task) return;
        const taskItemFiles = task.taskItems
            .filter(item => item.submittedFile)
            .map(item => ({
                taskItemId: item.id,
                fileId: item.submittedFile!.id
            }));

        try {
            await TasksApiClient.createTaskSubmission({
                taskId: task.id,
                taskItemFiles
            });
            showAlert("success", "Successfully submitted task");
            fetchTask();
        } catch {
            showAlert("error", "Failed to submit task");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-accent-1 p-6 rounded-2xl shadow border border-accent-2 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex-1 space-y-3">
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <p className="text-gray-300">{task.description || "No description provided."}</p>
                    {getApprovalStatus()}
                </div>
                {task.deadlineAt && (
                    <div className="bg-purple-900/30 border border-purple-600 px-4 py-2 rounded-xl">
                        <div className="text-sm font-semibold text-purple-200">Due Date</div>
                        <div className="text-lg text-white">{new Date(task.deadlineAt).toLocaleString()}</div>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {task.taskItems.map((item: GetAssignedTaskItem) => {
                    const fileExt = item.submittedFile?.name?.split(".").pop() || "";
                    const files = filesPerItem[item.id] || [];

                    return (
                        <div key={item.id} className="bg-accent-1 border border-accent-2 p-6 rounded-2xl space-y-6 shadow">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-3 flex-1">
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <p className="text-gray-300">{item.description || "No description provided."}</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="px-2 py-1 rounded bg-blue-900 border border-blue-600 text-blue-300">
                                            Type: {item.fileType?.name} ({item.fileType?.extension})
                                        </span>
                                        <span className="px-2 py-1 rounded bg-green-900 border border-green-600 text-green-300">
                                            Category: {item.fileCategory?.name}
                                        </span>
                                    </div>
                                </div>
                                {item.submittedFile && (
                                    <BsCheckCircleFill className="text-green-400 min-w-5 min-h-5 mt-1" />
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-700 bg-gray-900 p-4 rounded-xl space-y-4">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id={`upload-${item.id}`}
                                        accept="*"
                                        onChange={(e) => handleFileChange(item.id, e.target.files ? [e.target.files[0]] : [])}
                                    />
                                    <label
                                        htmlFor={`upload-${item.id}`}
                                        className="block text-center p-6 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer hover:border-blue-400 transition"
                                    >
                                        <p className="text-gray-300">Click or drag one file here</p>
                                    </label>
                                    {files.length > 0 && (
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li className="truncate">{files[0].name}</li>
                                        </ul>
                                    )}
                                    <Button className="w-full">Upload File</Button>
                                </div>

                                <div className="border border-gray-700 bg-gray-900 p-4 rounded-xl flex items-center justify-center">
                                    <button
                                        className="flex items-center gap-2 text-blue-300 hover:text-blue-500"
                                        onClick={() => {
                                            setSelectedTaskItem(item);
                                            setSelectFileModal(true);
                                        }}
                                    >
                                        <FaFolderOpen /> Select Existing File
                                    </button>
                                </div>
                            </div>

                            {item.submittedFile && (
                                <div
                                    onDoubleClick={() => setFilePreview({ open: true, file: item.submittedFile })}
                                    className="bg-gray-800 border border-gray-700 p-4 rounded-xl w-full cursor-pointer"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12">
                                            <FileIcon extension={fileExt} {...defaultStyles[fileExt]} radius={4} />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.submittedFile.name}</p>
                                            <p className="text-sm text-gray-400">{(item.submittedFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-700 pt-4">
                                <button
                                    className="text-left text-sm text-blue-400 hover:underline"
                                    onClick={() => setExpandedComment(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                >
                                    {expandedComment[item.id] ? "Hide" : "Show"} {item.comments.length} Comments
                                </button>

                                {expandedComment[item.id] && (
                                    <ul className="mt-3 space-y-2 text-sm text-gray-200">
                                        {item.comments.map(comment => (
                                            <li key={comment.id} className="border border-gray-700 p-3 rounded-lg bg-gray-800">
                                                <span className="font-semibold">{comment.fromUser?.email || "Anonymous"}:</span>
                                                <div dangerouslySetInnerHTML={{ __html: comment.commentHtml }} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="pt-6">
                    <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">Submit All Work</Button>
                </div>
            </div>

            <FileViewerModal
                open={filePreview.open}
                setOpen={(open) => setFilePreview(prev => ({ ...prev, open }))}
                fileId={filePreview.file?.id || ""}
                fileType={filePreview.file?.fileType?.extension}
                fileName={filePreview.file?.name}
            />

            {selectedTaskItem && (
                <SelectExistingFileModal
                    open={selectFileModal}
                    setOpen={setSelectFileModal}
                    taskItem={selectedTaskItem}
                    onFileSelect={handleFileSelectFromModal}
                />
            )}
        </div>
    );
};