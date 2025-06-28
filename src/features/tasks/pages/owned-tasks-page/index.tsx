import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client";
import { GetOwnedTaskResponse } from "../../types/get-owned-task-response";
import { FaCalendarAlt, FaQuestionCircle, FaTimesCircle, FaFileAlt } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { GetTaskSubmission } from "../../types/get-task-submission";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import { FiDownload } from "react-icons/fi";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { LlmApiClient } from "../../../../api/clients/llm-api-client";
import { TextAreaField } from "../../../../shared/components/forms/text-area-field";
import { toast } from "react-toastify";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";

export const OwnedTaskPage: FC = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<GetOwnedTaskResponse["task"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<GetTaskSubmission | null>(null);
    const [subLoading, setSubLoading] = useState(false);
    const [filePreview, setFilePreview] = useState<{ open: boolean; file: any | null }>({ open: false, file: null });
    const [fileStatuses, setFileStatuses] = useState<Record<string, number | null | undefined>>({});
    const [checking, setChecking] = useState(false);
    const [showDenyComment, setShowDenyComment] = useState(false);
    const [denyComment, setDenyComment] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const response = await TasksApiClient.getOwnedTask(taskId as string);
                setTask(response.task);
                if (response.task.assignees.length > 0) {
                    const firstUserId = response.task.assignees[0].id;
                    setSelectedUserId(firstUserId);
                    fetchSubmission(firstUserId);
                }
            } catch {
                setError("Failed to fetch task.");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    useEffect(() => {
        if (taskId && selectedUserId) {
            const saved = localStorage.getItem(`fileStatuses-${taskId}-${selectedUserId}`);
            if (saved) setFileStatuses(JSON.parse(saved));
            else setFileStatuses({});
        }
    }, [taskId, selectedUserId]);

    useEffect(() => {
        if (taskId && selectedUserId) {
            localStorage.setItem(`fileStatuses-${taskId}-${selectedUserId}`, JSON.stringify(fileStatuses));
        }
    }, [fileStatuses, taskId, selectedUserId]);

    const fetchSubmission = async (assigneeId: string) => {
        setSubLoading(true);
        setShowDenyComment(false);
        setDenyComment("");
        try {
            const res = await TasksApiClient.getTaskSubmissionsForAssignee(taskId as string, assigneeId);
            setSelectedSubmission(res.submissions[0]);
            setSelectedUserId(assigneeId);
        } finally {
            setSubLoading(false);
        }
    };

    const handleDownload = async (fileId: string, fileName: string) => {
        try {
            const response = await FileStorageApiClient.downloadFile(fileId);
            const blob = response instanceof Blob ? response : new Blob([response]);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleCheckFiles = async () => {
        if (!selectedSubmission || !task) return;
        setChecking(true);
        const updates: Record<string, number | null | undefined> = {};
        try {
            for (const file of selectedSubmission.taskItemFiles) {
                const taskItem = task.taskItems.find(item => item.id === file.taskItemId);
                const fileCategoryId = taskItem?.fileCategory?.id;
                if (!fileCategoryId) {
                    updates[file.id] = undefined;
                    continue;
                }
                const res = await LlmApiClient.checkFileCategory({ fileId: file.id, fileCategoryId: fileCategoryId });
                updates[file.id] = typeof res.matchPercentage === 'number' ? res.matchPercentage : undefined;
            }
            setFileStatuses(prev => ({ ...prev, ...updates }));
            showAlert("success", "Files checked with AI.");
        } catch {
            showAlert("error", "AI check failed.");
        } finally {
            setChecking(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedSubmission || !selectedUserId) return;
        try {
            await TasksApiClient.resolveTaskSubmission({
                submissionId: selectedSubmission.id,
                isApproved: true
            });
            showAlert("success", "Submission approved.");
            const refreshed = await TasksApiClient.getOwnedTask(taskId as string);
            setTask(refreshed.task);
            await fetchSubmission(selectedUserId);
        } catch {
            showAlert("error", "Failed to approve submission.");
        }
    };

    const handleDisapprove = async () => {
        if (!selectedSubmission || !selectedUserId || denyComment.trim() === "") {
            showAlert("error", "Please enter a comment to disapprove.");
            return;
        }
        try {
            await TasksApiClient.resolveTaskSubmission({
                submissionId: selectedSubmission.id,
                isApproved: false,
                dissaproveComment: denyComment.trim()
            });
            showAlert("success", "Submission disapproved.");
            const refreshed = await TasksApiClient.getOwnedTask(taskId as string);
            setTask(refreshed.task);
            await fetchSubmission(selectedUserId);
        } catch {
            showAlert("error", "Failed to disapprove submission.");
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-300">Loading...</div>;
    if (error || !task) return <div className="text-center mt-10 text-red-400">{error}</div>;

    const selectedUser = task.assignees.find(a => a.id === selectedUserId);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 text-gray-100 space-y-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow relative">
                {task.deadlineAt && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-700 text-white text-sm rounded-full">
                        {new Date(task.deadlineAt).toLocaleDateString()} • {(() => {
                        const dueDate = new Date(task.deadlineAt);
                        const now = new Date();
                        const diffTime = dueDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays > 0 ? `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}` : "Due today";
                    })()}
                    </div>
                )}
                <h1 className="text-2xl font-bold text-white mb-1">{task.title}</h1>
                <p className="text-sm text-gray-400 mb-1">Owned by <span className="text-white font-medium">{task.owner.email}</span></p>
                <p className="text-gray-300 mb-2">{task.description || "No description provided."}</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {task.assignees.map(user => (
                    <button
                        key={user.id}
                        onClick={() => fetchSubmission(user.id)}
                        className={`transition-all duration-150 px-4 py-2 rounded-lg text-sm font-medium flex flex-col items-start shadow-sm border ${
                            selectedUserId === user.id
                                ? "bg-indigo-600 text-white border-indigo-500 scale-[1.02]"
                                : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white"
                        }`}
                    >
                        <span>{user.email}</span>
                        {task.deadlineAt && (
                            <span className="text-xs text-gray-400">
                    Due: {new Date(task.deadlineAt).toLocaleDateString()}
                </span>
                        )}
                    </button>
                ))}
            </div>

            {subLoading && (
                <div className="flex justify-center pt-6">
                    <Spinner />
                </div>
            )}

            {!selectedSubmission && !subLoading && (
                <div className="flex flex-col items-center justify-center text-gray-400 mt-10 space-y-2">
                    <FaFileAlt className="text-5xl" />
                    <p className="text-lg">No submission available for this user</p>
                </div>
            )}

            {selectedSubmission && !subLoading && (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">
                            Reviewing files submitted by <span className="text-indigo-400">{selectedUser?.email}</span>
                        </h3>
                        <button
                            onClick={handleCheckFiles}
                            disabled={checking}
                            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                            {checking ? "Checking..." : "Check with AI"}
                        </button>
                    </div>

                    {task.taskItems.map(item => {
                        const file = selectedSubmission.taskItemFiles.find(f => f.taskItemId === item.id);
                        const fileExt = file?.name?.split(".").pop() || "";
                        const matchPercentage = file ? fileStatuses[file.id] : undefined;

                        return (
                            <div key={item.id} className="bg-gray-800 border border-gray-700 p-6 rounded-lg space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                                    <p className="text-gray-300">{item.description || "No description provided."}</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {item.fileType && (
                                            <span className="px-2 py-1 rounded bg-blue-800 text-blue-200">
                                                Type: {item.fileType.name} ({item.fileType.extension})
                                            </span>
                                        )}
                                        {item.fileCategory && (
                                            <span className="px-2 py-1 rounded bg-green-800 text-green-200">
                                                Category: {item.fileCategory.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {file ? (
                                    <div
                                        onDoubleClick={() => setFilePreview({ open: true, file })}
                                        className="cursor-pointer bg-gray-700 border border-gray-600 pt-4 pb-6 px-4 rounded-lg hover:border-indigo-500"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12">
                                                <FileIcon extension={fileExt} {...defaultStyles[fileExt]} radius={4} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{file.name}</p>
                                                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <div className="text-sm font-semibold w-32">
                                                {typeof matchPercentage === 'number' ? (
                                                    <div className="space-y-1">
                                                        <div className="text-white">{matchPercentage.toFixed(0)}% AI Approved</div>
                                                        <div className="h-2 w-full rounded bg-gray-600 overflow-hidden">
                                                            <div
                                                                className="h-full rounded"
                                                                style={{
                                                                    width: `${matchPercentage}%`,
                                                                    backgroundColor:
                                                                        matchPercentage >= 80
                                                                            ? '#16a34a'
                                                                            : matchPercentage >= 50
                                                                                ? '#facc15'
                                                                                : '#dc2626'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-yellow-500">Unverified</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(file.id, file.name);
                                                }}
                                                className="p-2 text-gray-400 hover:text-gray-200"
                                            >
                                                <FiDownload className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No file submitted</p>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleApprove}
                            className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => setShowDenyComment(prev => !prev)}
                            className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm"
                        >
                            Disapprove
                        </button>
                    </div>

                    {showDenyComment && (
                        <div className="space-y-4">
                            <TextAreaField
                                labelText="Rejection Reason"
                                value={denyComment}
                                setValue={setDenyComment}
                                placeholder="Enter reason for disapproval"
                                rows={4}
                            />
                            <button
                                onClick={handleDisapprove}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Submit Rejection
                            </button>
                        </div>
                    )}
                </div>
            )}

            <FileViewerModal
                open={filePreview.open}
                setOpen={(open) => setFilePreview(prev => ({ ...prev, open }))}
                fileId={filePreview.file?.id || ""}
                fileType={filePreview.file?.name?.split('.').pop()?.toLowerCase() || ""}
                fileName={filePreview.file?.name || "Untitled"}
            />

            {selectedUser?.approved === false && selectedSubmission?.dissaproveComment && (
                <div className="mt-8 bg-gray-800 border border-red-500/50 text-red-200 p-5 rounded-md shadow-sm">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-300">
                        <FaTimesCircle className="text-red-400" />
                        Submission Rejected
                    </h2>
                    <p className="text-sm text-red-200">You rejected this submission and gave the following reason:</p>
                    <p className="mt-2 italic text-red-300 border-l-4 border-red-400 pl-4">{selectedSubmission.dissaproveComment}</p>
                </div>
            )}
        </div>
    );
};
