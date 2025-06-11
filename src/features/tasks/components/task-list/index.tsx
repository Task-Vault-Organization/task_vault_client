import { FC } from "react";
import { GetTask } from "../../types/get-task.ts";
import {TaskCard} from "../task-card";
import { Button } from "../../../../shared/components/reusable/buttons/button";

interface TaskListProps {
    tasks: GetTask[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onCreate: () => void;
    onTaskClick: (id: string) => void;
    isOwnedTab: boolean;
}

export const TaskList: FC<TaskListProps> = ({
        tasks,
        isLoading,
        error,
        onRetry,
        onCreate,
        onTaskClick,
        isOwnedTab
    }) => {

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
                <Button onClick={onRetry}>Retry</Button>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center space-y-4 py-8">
                <p className="text-lg font-medium text-gray-400">
                    {isOwnedTab
                        ? "You have no owned tasks yet"
                        : "No assigned tasks found. Check back later! ⏳"}
                </p>
                <Button onClick={isOwnedTab ? onCreate : onRetry}>
                    {isOwnedTab ? "Create a Task" : "Refresh"}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 py-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} isOwnedTab={isOwnedTab} />
            ))}
        </div>
    );
};