import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client";
import { GetOwnedTaskResponse } from "../../types/get-owned-task-response";
import { FaCalendarAlt, FaQuestionCircle, FaTimesCircle } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { GetTaskSubmission } from "../../types/get-task-submission";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import { FileViewerModal } from "../../../../shared/components/modals/file-viewer-modal";
import { FaFileAlt } from "react-icons/fa";
import { LlmApiClient } from "../../../../api/clients/llm-api-client";

export const OwnedTaskPage: FC = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<GetOwnedTaskResponse["task"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<GetTaskSubmission | null>(null);
    const [subLoading, setSubLoading] = useState(false);
    const [filePreview, setFilePreview] = useState<{ open: boolean; file: any | null }>({ open: false, file: null });
    const [checkResults, setCheckResults] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState(false);

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
        if (!selectedSubmission) return;
        const storedResults = localStorage.getItem(`file-check-results-${selectedSubmission.id}`);
        if (storedResults) {
            setCheckResults(JSON.parse(storedResults));
        }
    }, [selectedSubmission]);

    const getStatusIcon = (status: boolean | null | undefined) => {
        if (status === true) return <BsCheckCircleFill className="text-green-400 w-4 h-4" />;
        if (status === false) return <FaTimesCircle className="text-red-400 w-4 h-4" />;
        return <FaQuestionCircle className="text-yellow-400 w-4 h-4" />;
    };

    const fetchSubmission = async (assigneeId: string) => {
        setSubLoading(true);
        try {
            const res = await TasksApiClient.getTaskSubmissionsForAssignee(taskId as string, assigneeId);
            setSelectedSubmission(res.submissions[0]);
            setSelectedUserId(assigneeId);
        } finally {
            setSubLoading(false);
        }
    };

    const checkAllFiles = async () => {
        if (!selectedSubmission) return;
        setChecking(true);
        const newResults: Record<string, boolean> = {};

        for (const item of task?.taskItems || []) {
            const file = selectedSubmission.taskItemFiles.find(f => f.taskItemId === item.id);
            if (file && item.fileCategory?.id) {
                try {
                    const res = await LlmApiClient.checkFileCategory({
                        fileId: file.id,
                        fileCategoryId: item.fileCategory.id
                    });
                    newResults[file.id] = res.matchPercentage > 80;
                } catch {
                    newResults[file.id] = false;
                }
            }
        }

        setCheckResults(newResults);
        localStorage.setItem(`file-check-results-${selectedSubmission.id}`, JSON.stringify(newResults));
        setChecking(false);
    };

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (error || !task) return <div className="text-red-500 text-center mt-10">{error}</div>;

    const approved = task.assignees.filter(a => a.approved === true).length;
    const denied = task.assignees.filter(a => a.approved === false).length;
    const pending = task.assignees.filter(a => a.approved == null).length;

    const selectedUser = task.assignees.find(a => a.id === selectedUserId);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 text-white space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-accent-1 p-6 rounded-2xl shadow border border-accent-2 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex-1 space-y-3">
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <p className="text-gray-300">{task.description || "No description provided."}</p>
                    <p className="text-sm text-gray-400">{approved} approved, {denied} denied, {pending} pending</p>
                </div>
                {task.deadlineAt && (
                    <div className="bg-purple-900/30 border border-purple-600 px-4 py-2 rounded-xl">
                        <div className="text-sm font-semibold text-purple-200 flex items-center gap-1">
                            <FaCalendarAlt /> Due Date
                        </div>
                        <div className="text-lg text-white">{new Date(task.deadlineAt).toLocaleString()}</div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 pb-2">
                {task.assignees.map(user => (
                    <button
                        key={user.id}
                        onClick={() => fetchSubmission(user.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                            selectedUserId === user.id
                                ? "bg-accent-2 text-white border-accent-2"
                                : "bg-gray-800 text-gray-300 border-gray-600"
                        }`}
                    >
                        <span>{user.email.split("@")[0]}</span>
                        {getStatusIcon(user.approved)}
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
                        <h3 className="text-xl font-semibold text-white border-b border-accent-2 pb-2">
                            {selectedUser?.email}'s submission
                        </h3>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={checkAllFiles} disabled={checking}>
                            {checking ? "Checking..." : "Check File Categories"}
                        </Button>
                    </div>

                    {task.taskItems.map(item => {
                        const file = selectedSubmission.taskItemFiles.find(f => f.taskItemId === item.id);
                        const fileExt = file?.name?.split(".").pop() || "";
                        const checkStatus = file ? checkResults[file.id] : null;

                        return (
                            <div key={item.id} className="bg-accent-1 border border-accent-2 p-6 rounded-2xl space-y-6 shadow">
                                <div className="space-y-3">
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <p className="text-gray-300">{item.description || "No description provided."}</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {item.fileType && (
                                            <span className="px-2 py-1 rounded bg-blue-900 border border-blue-600 text-blue-300">
                                                Type: {item.fileType.name} ({item.fileType.extension})
                                            </span>
                                        )}
                                        {item.fileCategory && (
                                            <span className="px-2 py-1 rounded bg-green-900 border border-green-600 text-green-300">
                                                Category: {item.fileCategory.name}
                                            </span>
                                        )}
                                        {file && checkStatus != null && (
                                            <span className={`px-2 py-1 rounded border ${checkStatus ? "bg-green-800 border-green-600 text-green-300" : "bg-red-800 border-red-600 text-red-300"}`}>
                                                Match: {checkStatus ? "✔ Success" : "✖ Failed"}
                                            </span>
                                        )}
                                    </div>

                                    {file ? (
                                        <div
                                            onDoubleClick={() => setFilePreview({ open: true, file })}
                                            className="cursor-pointer bg-gray-800 border border-gray-700 p-4 rounded-xl w-full"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12">
                                                    <FileIcon extension={fileExt} {...defaultStyles[fileExt]} radius={4} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{file.name}</p>
                                                    <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">No file submitted</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <FileViewerModal
                open={filePreview.open}
                setOpen={(open) => setFilePreview(prev => ({ ...prev, open }))}
                fileId={filePreview.file?.id || ""}
                fileType={filePreview.file?.fileType?.extension}
                fileName={filePreview.file?.name}
            />
        </div>
    );
};