import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetTask } from "../types/get-task";
import { TasksApiClient } from "../../../api/clients/tasks-api-client";
import {TaskTabs} from "./task-tabs";
import {TaskList} from "./task-list";

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
                const response = activeTab === "owned"
                    ? await TasksApiClient.getOwnedTasks()
                    : await TasksApiClient.getAssignedTasks();
                activeTab === "owned"
                    ? setOwnedTasks(response.task || [])
                    : setAssignedTasks(response.task || []);
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
        navigate("/task/new");
    };

    return (
        <div className="mx-auto space-y-6 mb-10 max-w-3xl">
            <h2 className="text-2xl font-semibold text-center text-white">My Tasks</h2>
            <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="px-4">
                <TaskList
                    tasks={activeTab === "owned" ? ownedTasks : assignedTasks}
                    isLoading={isLoading}
                    error={error}
                    onRetry={() => window.location.reload()}
                    onCreate={handleCreateTask}
                    onTaskClick={handleTaskClick}
                    isOwnedTab={activeTab === "owned"}
                />
            </div>
        </div>
    );
};