import { FC } from "react";
import { GetTask } from "../../types/get-task";
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
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
            ))}
            {isOwnedTab && (
                <Button
                    fullWidth={true}
                    onClick={onCreate}
                    className="w-full py-4 px-4 flex items-center justify-center space-x-2 text-gray-300 bg-accent-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded-lg shadow-md transition-all duration-300"
                >
                    <span>+ Add New Task</span>
                </Button>
            )}
        </div>
    );
};