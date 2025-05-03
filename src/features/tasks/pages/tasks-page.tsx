import { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PlusIcon } from "@heroicons/react/24/solid";
import {GetTask} from "../types/get-task.ts";
import {TasksApiClient} from "../../../api/clients/tasks-api-client.ts";

export const TaskPage: FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"owned" | "assigned">("owned");
    const [ownedTasks, setOwnedTasks] = useState<GetTask[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<GetTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (activeTab === "owned") {
                    const response = await TasksApiClient.getOwnedTasks();
                    setOwnedTasks(response.task || []);
                } else {
                    const response = await TasksApiClient.getAssignedTasks();
                    setAssignedTasks(response.task || []);
                }
            } catch (err) {
                setError("Failed to fetch tasks. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [activeTab]);

    const handleTaskClick = (taskId: string) => {
        navigate(`/task/${taskId}`);
    };

    const handleCreateTask = () => {
        navigate('/task/new');
    };

    const renderTaskList = (tasks: GetTask[]) => {
        if (isLoading) {
            return (
                <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="py-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (tasks.length === 0) {
            return (
                <div className="flex flex-col items-center space-y-4 py-8">
                    <p className="text-lg font-medium text-gray-500">
                        {activeTab === "owned"
                            ? "You have no owned tasks yet"
                            : "No assigned tasks found. Check back later! ⏳"}
                    </p>
                    <button
                        className={`px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all ${
                            activeTab === "owned"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-600 text-white hover:bg-gray-700"
                        }`}
                        onClick={activeTab === "owned" ? handleCreateTask : () => window.location.reload()}
                    >
                        {activeTab === "owned" ? "Create a Task" : "Refresh"}
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-4 py-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => handleTaskClick(task.id)}
                        className="p-5 border rounded-xl hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                task.statusId === 1 ? 'bg-blue-100 text-blue-800' :
                                    task.statusId === 2 ? 'bg-yellow-100 text-yellow-800' :
                                        task.statusId === 3 ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                            }`}>
                                {task.status?.name || 'Unknown'}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <span className="text-gray-500">
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                            {task.deadlineAt && (
                                <span className={`px-2 py-1 rounded ${
                                    new Date(task.deadlineAt) < new Date()
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-purple-100 text-purple-800'
                                }`}>
                                    Due: {new Date(task.deadlineAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add new task button for owned tasks */}
                {activeTab === "owned" && (
                    <button
                        onClick={handleCreateTask}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-gray-500 hover:text-blue-600"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add New Task</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 md:mt-12 bg-white shadow-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200">
            <div className="flex justify-center space-x-4 md:space-x-6 border-b pb-3">
                <button
                    className={`cursor-pointer p-2 md:p-3 text-md md:text-lg font-semibold rounded-t-lg transition-all duration-300 ${
                        activeTab === "owned"
                            ? "border-b-4 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setActiveTab("owned")}
                >
                    🏠 Owned Tasks
                </button>
                <button
                    className={`cursor-pointer p-2 md:p-3 text-md md:text-lg font-semibold rounded-t-lg transition-all duration-300 ${
                        activeTab === "assigned"
                            ? "border-b-4 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setActiveTab("assigned")}
                >
                    📌 Assigned Tasks
                </button>
            </div>

            <div className="p-2 md:p-4">
                {activeTab === "owned" && renderTaskList(ownedTasks)}
                {activeTab === "assigned" && renderTaskList(assignedTasks)}
            </div>
        </div>
    );
};