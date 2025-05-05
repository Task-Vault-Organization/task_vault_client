import { FC } from "react";
import { GetTask } from "../../types/get-task";

interface Props {
    task: GetTask;
}

export const TaskDetailHeader: FC<Props> = ({ task }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-md text-white space-y-4 md:space-y-0">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">{task.title}</h1>
            </div>
            <span className={`px-4 py-1 text-sm font-medium rounded-full shadow ${
                task.statusId === 1 ? 'bg-blue-200 text-blue-900' :
                    task.statusId === 2 ? 'bg-yellow-200 text-yellow-900' :
                        'bg-gray-300 text-gray-800'
            }`}>
                {task.status?.name || 'Unknown'}
            </span>
        </div>
    );
};