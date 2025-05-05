import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GetTask } from "../../types/get-task.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";
import {useAuthenticationStore} from "../../../authentication/stores/authentication-store.ts";
import {AuthenticationState} from "../../../authentication/types/authentication-state.ts";
import {TaskDetailHeader} from "../../components/task-detail-header";
import {TaskItemList} from "../../components/task-item-list";
import {UsersList} from "../../../../shared/components/reusable/users/users-list";

export const TaskPage: FC = () => {
    const { taskId } = useParams();
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);
    const [task, setTask] = useState<GetTask | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await TasksApiClient.getTask(taskId as string);
                setTask(response.task);
            } catch (err) {
                setError("Failed to load task.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!task) return null;

    const isOwner = user?.id === task.ownerId;
    const isAssigned = task.assignees?.some(a => a.id === user?.id);
    const isOnlyOwner = isOwner && !isAssigned;
    const isOnlyAssignee = isAssigned && !isOwner;

    return (
        <div className="max-w-5xl mx-auto mt-10 space-y-8 px-4">
            <TaskDetailHeader task={task} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-accent-1 p-6 rounded-2xl shadow border border-accent-2 text-white space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Task Overview</h2>
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="border-t border-accent-3 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                            <div>
                                <span className="block text-gray-400 font-semibold mb-1">Created At</span>
                                <span>{new Date(task.createdAt).toLocaleString()}</span>
                            </div>
                            {task.deadlineAt && (
                                <div>
                                    <span className="block text-gray-400 font-semibold mb-1">Deadline</span>
                                    <span
                                        className={
                                            new Date(task.deadlineAt) < new Date()
                                                ? "text-red-400"
                                                : "text-purple-300"
                                        }
                                    >
                                    {new Date(task.deadlineAt).toLocaleString()}
                                </span>
                                </div>
                            )}
                            <div>
                                <span className="block text-gray-400 font-semibold mb-1">Status</span>
                                <span>{task.status?.name ?? "Unknown"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent-1 p-6 rounded-2xl shadow border border-accent-2 text-white">
                        <TaskItemList items={task.taskItems || []} canSubmit={isAssigned} task={task} />
                    </div>
                </div>

                <div className="space-y-6">
                    {isOnlyOwner && (
                        <>
                            <div className="bg-accent-1 p-6 rounded-2xl shadow border border-accent-2 text-white">
                                <h3 className="text-lg font-semibold mb-2">Assignees</h3>
                                <UsersList users={task.assignees} userRemovable={false} />
                            </div>
                            <div className="p-6 bg-blue-950/40 border border-blue-500 rounded-xl text-white shadow">
                                <h3 className="text-lg font-semibold mb-2">Task Submissions</h3>
                                <p className="text-sm text-blue-200">You will see the list of submissions here once implemented.</p>
                            </div>
                        </>
                    )}

                    {isOnlyAssignee && (
                        <div className="p-6 bg-green-950/40 border border-green-500 rounded-xl text-white shadow space-y-4">
                            <h3 className="text-lg font-semibold">Submit Your Work</h3>
                            <p className="text-sm text-green-200">Click on a task item below to submit your answer.</p>
                        </div>
                    )}

                    {isOwner && isAssigned && (
                        <div className="p-6 bg-indigo-900/40 border border-indigo-500 rounded-xl text-white shadow">
                            <h3 className="text-lg font-semibold mb-2">You are both the Owner and an Assignee</h3>
                            <p className="text-sm text-indigo-200">You can submit your own work, but you won’t see other assignees listed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};