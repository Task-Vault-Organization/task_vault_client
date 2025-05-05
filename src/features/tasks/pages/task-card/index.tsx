import { FC } from "react";
import { GetTask } from "../../types/get-task";
import {UsersList} from "../../../../shared/components/reusable/users/users-list";

interface TaskCardProps {
    task: GetTask;
    onClick: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onClick }) => {
    const isOverdue = task.deadlineAt && new Date(task.deadlineAt) < new Date();

    return (
        <div
            onDoubleClick={onClick}
            className="py-4 px-4 group flex flex-col gap-3 text-white bg-accent-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg truncate">{task.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                    task.statusId === 1 ? 'bg-blue-200 text-blue-800' :
                        task.statusId === 2 ? 'bg-yellow-200 text-yellow-800' :
                            task.statusId === 3 ? 'bg-green-200 text-green-800' :
                                'bg-gray-200 text-gray-800'
                }`}>
                    {task.status?.name || 'Unknown'}
                </span>
            </div>
            <p className="text-gray-200 line-clamp-2">{task.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-300 group-hover:text-gray-100">
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                {task.deadlineAt && (
                    <span className={`px-2 py-1 rounded ${
                        isOverdue ? 'bg-red-200 text-red-800' : 'bg-purple-200 text-purple-800'
                    }`}>
                        Due: {new Date(task.deadlineAt).toLocaleDateString()}
                    </span>
                )}
            </div>
            <div className={"my-2"}>
                <UsersList users={task.assignees}  userRemovable={false} />
            </div>
        </div>
    );
};