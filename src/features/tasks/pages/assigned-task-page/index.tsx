import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client";
import { GetAssignedTaskResponse } from "../../types/get-assigned-task-response";
import { FaFolderOpen, FaTimes } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { GetAssignedTaskItem } from "../../types/get-assigned-task-item";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store";
import { AuthenticationState } from "../../../authentication/types/authentication-state";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { GetFile } from "../../../file-storage/types/get-file";
import { SelectExistingFileModal } from "../../../../shared/components/modals/select-existing-file-modal";
import { showAlert } from "../../../../shared/helpers/alerts-helpers";
import { CustomBgButton } from "../../../../shared/components/reusable/buttons/custom-bg-button";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";

export const AssignedTaskPage: FC = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<GetAssignedTaskResponse["task"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filesPerItem, setFilesPerItem] = useState<Record<string, File[]>>({});
    const [uploadingItems, setUploadingItems] = useState<Record<string, boolean>>({});
    const [filePreview, setFilePreview] = useState<{ open: boolean; file: any | null }>({ open: false, file: null });
    const [selectFileModal, setSelectFileModal] = useState(false);
    const [selectedTaskItem, setSelectedTaskItem] = useState<GetAssignedTaskItem | null>(null);
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
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
        fetchTask();
    }, [taskId]);

    if (loading) return <div className="text-center mt-10 text-gray-300">Loading...</div>;
    if (error || !task) return <div className="text-center mt-10 text-red-400">{error}</div>;

    const getTimeUntilDue = (dateString: string) => {
        const dueDate = new Date(dateString);
        const now = new Date();
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}` : "Due today";
    };

    const getApprovalStatus = () => {
        if (task.approved === true) return <span className="text-green-500 font-medium">Approved</span>;
        if (task.approved === false) return <span className="text-red-500 font-medium">Rejected</span>;
        return <span className="text-yellow-400 font-medium">Pending</span>;
    };

    const handleFileChange = (itemId: string, files: File[]) => {
        setFilesPerItem(prev => ({ ...prev, [itemId]: files }));
    };

    const handleFileUpload = async (itemId: string) => {
        const files = filesPerItem[itemId];
        if (!files || files.length === 0 || !user?.rootDirectoryId) return;

        setUploadingItems(prev => ({ ...prev, [itemId]: true }));

        try {
            const response = await FileStorageApiClient.uploadFile({
                files,
                directoryId: user.rootDirectoryId
            });

            const uploadedFile = response?.uploadedFiles?.[0];
            if (uploadedFile) {
                const updatedItems = task!.taskItems.map(item =>
                    item.id === itemId ? { ...item, submittedFile: uploadedFile } : item
                );
                setTask({ ...task!, taskItems: updatedItems });
                showAlert("success", "File uploaded successfully!");
                setFilesPerItem(prev => ({ ...prev, [itemId]: [] }));
                if (inputRefs.current[itemId]) inputRefs.current[itemId]!.value = "";
            }
        } catch {
            showAlert("error", "File upload failed");
        } finally {
            setUploadingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleFileSelectFromModal = (itemId: string, file: GetFile) => {
        if (!task) return;
        const updatedItems = task.taskItems.map(item =>
            item.id === itemId ? { ...item, submittedFile: file } : item
        );
        setTask({ ...task, taskItems: updatedItems });
    };

    const removeSubmittedFile = (itemId: string) => {
        if (!task) return;
        const updatedItems = task.taskItems.map(item =>
            item.id === itemId ? { ...item, submittedFile: undefined } : item
        );
        setTask({ ...task, taskItems: updatedItems });
    };

    const handleSubmit = async () => {
        if (!task) return;
        const taskItemFiles = task.taskItems
            .filter(item => item.submittedFile)
            .map(item => ({ taskItemId: item.id, fileId: item.submittedFile!.id }));

        try {
            await TasksApiClient.createTaskSubmission({ taskId: task.id, taskItemFiles });
            showAlert("success", "Successfully submitted task");
            const refreshed = await TasksApiClient.getAssignedTask(task.id);
            setTask(refreshed.task);
        } catch {
            showAlert("error", "Failed to submit task");
        }
    };

    const isSubmitDisabled = task.taskItems.every(item => !item.submittedFile);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-gray-100">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl relative">
                {task.deadlineAt && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                        {new Date(task.deadlineAt).toLocaleDateString()} • {getTimeUntilDue(task.deadlineAt)}
                    </div>
                )}
                <h1 className="text-3xl font-bold text-white mb-1 leading-tight">{task.title}</h1>
                <p className="text-sm text-gray-400 mb-1">Owned by <span className="text-white font-medium">{task.owner?.email}</span></p>
                <p className="text-gray-300 mb-4">{task.description || "No description provided."}</p>
                <div className="text-sm">{getApprovalStatus()}</div>
            </div>

            {task.taskItems.map(item => {
                const fileExt = item.submittedFile?.name?.split(".").pop() || "";
                const files = filesPerItem[item.id] || [];
                const uploading = uploadingItems[item.id] || false;
                const acceptExt = item.fileType?.extension ? `.${item.fileType.extension}` : "";

                return (
                    <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1 flex-1">
                                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                                <p className="text-gray-300">{item.description || "No description provided."}</p>
                                <div className="flex gap-4 text-sm">
                                    <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded">Type: {item.fileType?.name} ({item.fileType?.extension})</span>
                                    <span className="bg-green-800 text-green-200 px-2 py-1 rounded">Category: {item.fileCategory?.name}</span>
                                </div>
                            </div>
                            {item.submittedFile && <BsCheckCircleFill className="text-green-500 mt-1" />}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-800">
                                <input
                                    type="file"
                                    className="hidden"
                                    id={`upload-${item.id}`}
                                    ref={(el) => (inputRefs.current[item.id] = el)}
                                    accept={acceptExt}
                                    onChange={(e) => handleFileChange(item.id, e.target.files ? [e.target.files[0]] : [])}
                                />
                                <label
                                    htmlFor={`upload-${item.id}`}
                                    className="block text-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 text-gray-200"
                                >
                                    Click to upload file
                                </label>
                                {files.length > 0 && (
                                    <p className="text-sm text-gray-300 truncate">{files[0].name}</p>
                                )}
                                <CustomBgButton
                                    background="bg-gray-700"
                                    className="w-full"
                                    disabled={files.length === 0 || uploading}
                                    onClick={() => handleFileUpload(item.id)}
                                >
                                    {uploading ? "Uploading..." : "Upload File"}
                                </CustomBgButton>
                            </div>

                            <div className="border border-gray-700 rounded-lg p-4 flex items-center justify-center bg-gray-800">
                                <button
                                    className="flex items-center gap-2 text-gray-100 hover:text-white"
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
                                className="bg-gray-800 border border-gray-600 px-5 pt-5 pb-6 rounded-lg relative cursor-pointer"
                                onDoubleClick={() => setFilePreview({ open: true, file: item.submittedFile })}
                            >
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSubmittedFile(item.id);
                                        }}
                                        className="text-gray-400 hover:text-red-400 transition"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12">
                                        <FileIcon extension={fileExt} {...defaultStyles[fileExt]} radius={4} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{item.submittedFile.name}</p>
                                        <p className="text-sm text-gray-400">{(item.submittedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    className={`w-full text-white/60 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all duration-300 ease-in-out focus:ring-4 focus:outline-none ${
                        isSubmitDisabled
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-green-800 hover:bg-green-500 hover:scale-[1.01] active:scale-95'
                    }`}
                >
                    Submit All Work
                </button>
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
            {task.approved === false && task.dissaprovedComment && (
                <div className="mt-10 bg-gray-800 border border-red-600/50 text-red-100 p-5 rounded-md shadow-sm">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-300">
                        <FaTimes className="text-red-400" />
                        Submission Rejected
                    </h2>
                    <p className="text-sm text-red-200">
                        Your submission was rejected by{" "}
                        <span className="font-medium text-red-300">{task.owner?.email || "the reviewer"}</span>. They left the following note:
                    </p>
                    <p className="mt-2 italic text-red-300 border-l-4 border-red-500 pl-4">{task.dissaprovedComment}</p>
                </div>
            )}
        </div>
    );
};