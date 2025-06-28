import { FC } from "react";
import { GetTask } from "../../types/get-task.ts";
import {TaskCard} from "../task-card";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import {FaPlus} from "react-icons/fa";
import {useNavigate} from "react-router";

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

    const navigate = useNavigate();

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

    const handleCreateTask = () => {
        navigate("/task/new");
    };

    return (
        <div className="space-y-4 py-4">
            <Button onClick={handleCreateTask} className="w-full">
                <FaPlus className="mr-2" />
                Create Task
            </Button>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} isOwnedTab={isOwnedTab} />
            ))}
        </div>
    );
};