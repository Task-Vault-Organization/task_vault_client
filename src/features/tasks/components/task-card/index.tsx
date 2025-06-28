import { FC } from "react";
import { GetAssignedTask } from "../../types/get-assigned-task";
import { GetOwnedTask } from "../../types/get-owned-task";
import { UsersList } from "../../../../shared/components/reusable/users/users-list";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import { UserAvatar } from "../../../../shared/components/reusable/users/user-avatar";

type Task = GetOwnedTask | GetAssignedTask;

interface TaskCardProps {
    task: Task;
    onClick: () => void;
    isOwnedTab: boolean;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onClick, isOwnedTab }) => {
    const isOverdue = task.deadlineAt && new Date(task.deadlineAt) < new Date();

    const getRelativeTime = (dateString: string) => {
        const target = new Date(dateString).getTime();
        const now = new Date().getTime();
        const diff = target - now;
        const abs = Math.abs(diff);
        const minutes = Math.floor(abs / 60000);
        const hours = Math.floor(abs / 3600000);
        const days = Math.floor(abs / 86400000);

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ${diff > 0 ? "left" : "ago"}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ${diff > 0 ? "left" : "ago"}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ${diff > 0 ? "left" : "ago"}`;
        return diff > 0 ? "moments left" : "just now";
    };

    return (
        <div
            onDoubleClick={onClick}
            className="py-5 px-6 flex flex-col gap-4 text-gray-100 bg-gray-800 border border-gray-700 rounded-xl shadow hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-white truncate">{task.title}</h3>
                <span
                    className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                        task.statusId === 1
                            ? "bg-blue-800 text-blue-200"
                            : task.statusId === 2
                                ? "bg-yellow-700 text-yellow-200"
                                : task.statusId === 3
                                    ? "bg-green-700 text-green-200"
                                    : "bg-gray-700 text-gray-300"
                    }`}
                >
                    {task.status?.name || "Unknown"}
                </span>
            </div>

            <p className="text-sm text-gray-300 line-clamp-2">{task.description}</p>

            <div className="flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <span className="font-semibold">Created:</span>
                    <span>
                        {new Date(task.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>
                {task.deadlineAt && (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isOverdue ? "bg-red-800 text-red-300" : "bg-purple-800 text-purple-200"
                        }`}
                    >
                        Due: {new Date(task.deadlineAt).toLocaleDateString()} • {getRelativeTime(task.deadlineAt)}
                    </span>
                )}
            </div>

            {task.owner && (
                <div className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg mt-1">
                    <UserAvatar user={task.owner} size={28} />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs text-gray-400">Owner</span>
                        <span className="text-sm text-white font-medium">{task.owner.email}</span>
                    </div>
                </div>
            )}

            {("assignees" in task && task.assignees.length > 0) && (
                <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xs text-gray-400 font-semibold mb-2">Assignees</span>
                    <UsersList users={task.assignees} userRemovable={false} />
                </div>
            )}

            {!isOwnedTab && (
                <div className="flex items-center gap-2 text-sm mt-2">
                    {task.approved === true && (
                        <span className="flex items-center gap-1 text-green-400 font-semibold">
                            <FaCheckCircle /> Approved
                        </span>
                    )}
                    {task.approved === false && (
                        <span className="flex items-center gap-1 text-red-400 font-semibold">
                            <FaTimesCircle /> Rejected
                        </span>
                    )}
                    {task.approved === null && (
                        <span className="flex items-center gap-1 text-yellow-300 font-semibold">
                            <FaQuestionCircle /> Pending
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};