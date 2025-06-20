import { FC } from "react";
import { GetAssignedTask } from "../../types/get-assigned-task";
import { GetOwnedTask } from "../../types/get-owned-task";
import { UsersList } from "../../../../shared/components/reusable/users/users-list";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";

type Task = GetOwnedTask | GetAssignedTask;

interface TaskCardProps {
    task: Task;
    onClick: () => void;
    isOwnedTab: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onClick, isOwnedTab }) => {
    const isOverdue = task.deadlineAt && new Date(task.deadlineAt) < new Date();

    return (
        <div
            onDoubleClick={onClick}
            className="py-4 px-4 flex flex-col gap-3 text-white bg-accent-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out dark:hover:bg-gray-700 cursor-pointer dark:border dark:border-gray-700"
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
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold tracking-wide">Created:</span>
                    <span className="font-bold">
                        {new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                </div>
                {task.deadlineAt && (
                    <span className={`px-2 py-1 rounded ${
                        isOverdue ? 'bg-red-200 text-red-800' : 'bg-purple-200 text-purple-800'
                    }`}>
                        Due: {new Date(task.deadlineAt).toLocaleDateString()}
                    </span>
                )}
            </div>
            <div className="my-2">
                {isOwnedTab ? (
                    <UsersList users={"assignees" in task ? task.assignees : []} userRemovable={false} />
                ) : (
                    <div className="flex items-center gap-2 text-sm">
                        {task.approved === true && (
                            <span className="flex items-center gap-1 text-green-500 font-semibold">
                                <FaCheckCircle /> Approved
                            </span>
                        )}
                        {task.approved === false && (
                            <span className="flex items-center gap-1 text-red-500 font-semibold">
                                <FaTimesCircle /> Rejected
                            </span>
                        )}
                        {task.approved === null && (
                            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                                <FaQuestionCircle /> Pending
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};