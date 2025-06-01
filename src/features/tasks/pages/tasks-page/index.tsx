import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetTask } from "../../types/get-task.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";
import { TaskList } from "../../components/task-list";
import { EmptyCollectionPlaceholder } from "../../../../shared/components/reusable/empty-collection-placeholder";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import { FaUserEdit, FaUserCheck, FaTasks, FaPlus } from "react-icons/fa";
import { Button } from "../../../../shared/components/reusable/buttons/button";

export const TasksPage: FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"owned" | "assigned">(
        (localStorage.getItem("taskTab") as "owned" | "assigned") || "owned"
    );
    const [ownedTasks, setOwnedTasks] = useState<GetTask[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<GetTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = activeTab === "owned"
                    ? await TasksApiClient.getOwnedTasks()
                    : await TasksApiClient.getAssignedTasks();
                activeTab === "owned"
                    ? setOwnedTasks(response.task || [])
                    : setAssignedTasks(response.task || []);
            } catch (err) {
                setError("Failed to fetch tasks. Please try again.");
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
        navigate("/task/new");
    };

    return (
        <div className="mx-auto space-y-6 mb-10 max-w-4xl px-4 sm:px-10">
            <h2 className="text-2xl font-semibold text-center text-white">My Tasks</h2>
            <div className="border-b border-gray-800 py-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                setActiveTab("owned");
                                localStorage.setItem("taskTab", "owned");
                            }}
                            className={`px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition-all ${
                                activeTab === "owned"
                                    ? "bg-accent-2 text-white shadow-md"
                                    : "text-gray-400 hover:text-white hover:bg-accent-1"
                            }`}
                        >
                            <FaUserEdit />
                            Owned Tasks
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("assigned");
                                localStorage.setItem("taskTab", "assigned");
                            }}
                            className={`px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition-all ${
                                activeTab === "assigned"
                                    ? "bg-accent-2 text-white shadow-md"
                                    : "text-gray-400 hover:text-white hover:bg-accent-1"
                            }`}
                        >
                            <FaUserCheck />
                            Assigned Tasks
                        </button>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={handleCreateTask}
                            className="w-full sm:w-auto justify-center"
                        >
                            <FaPlus className="mr-1" />
                            Create Task
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (activeTab === "owned" ? ownedTasks.length === 0 : assignedTasks.length === 0) ? (
                <EmptyCollectionPlaceholder
                    icon={<FaTasks />}
                    text={"No tasks found"}
                    subtext={"Use the button above to create a new task"}
                />
            ) : (
                <TaskList
                    tasks={activeTab === "owned" ? ownedTasks : assignedTasks}
                    isLoading={isLoading}
                    error={error}
                    onRetry={() => window.location.reload()}
                    onCreate={handleCreateTask}
                    onTaskClick={handleTaskClick}
                    isOwnedTab={activeTab === "owned"}
                />
            )}
        </div>
    );
};