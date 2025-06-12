import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetTask } from "../../types/get-task.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";
import { TaskList } from "../../components/task-list";
import { EmptyCollectionPlaceholder } from "../../../../shared/components/reusable/empty-collection-placeholder";
import { Spinner } from "../../../../shared/components/reusable/loading/spinner";
import {
    FaUserEdit,
    FaUserCheck,
    FaTasks,
    FaPlus,
    FaSortAmountDown,
    FaSortAmountUp
} from "react-icons/fa";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import { SelectField } from "../../../../shared/components/forms/select-field";

const statusOptions = [
    { id: 0, name: "All" },
    { id: 1, name: "Started" },
    { id: 2, name: "Completed" }
];

const sortOptions = [
    { id: 0, name: "Newest", icon: <FaSortAmountDown className="inline mr-1" /> },
    { id: 1, name: "Oldest", icon: <FaSortAmountUp className="inline mr-1" /> }
];

export const TasksPage: FC = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"owned" | "assigned">(
        (localStorage.getItem("taskTab") as "owned" | "assigned") || "owned"
    );

    const [sortByIndex, setSortByIndex] = useState<number>(
        Number(localStorage.getItem("sortByIndex")) || 0
    );

    const [filterBy, setFilterBy] = useState<number>(
        Number(localStorage.getItem("filterBy")) || 0
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
                const sortValue = sortByIndex === 0 ? "newest" : "oldest";
                const statusFilter = statusOptions[filterBy].name.toLowerCase();
                if (activeTab === "owned") {
                    const res = await TasksApiClient.getOwnedTasks(sortValue, statusFilter);
                    setOwnedTasks(res.tasks || []);
                } else {
                    const res = await TasksApiClient.getAssignedTasks(sortValue, statusFilter);
                    setAssignedTasks(res.tasks || []);
                }
            } catch {
                setError("Failed to fetch tasks. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, [activeTab, sortByIndex, filterBy]);

    const handleTabChange = (tab: "owned" | "assigned") => {
        setActiveTab(tab);
        localStorage.setItem("taskTab", tab);
    };

    const handleSortChange = (index: number) => {
        setSortByIndex(index);
        localStorage.setItem("sortByIndex", index.toString());
    };

    const handleFilterChange = (val: number) => {
        setFilterBy(val);
        localStorage.setItem("filterBy", val.toString());
    };

    const handleTaskClick = (taskId: string) => {
        const path = activeTab === "owned" ? `/task/owned/${taskId}` : `/task/assigned/${taskId}`;
        navigate(path);
    };

    const handleCreateTask = () => {
        navigate("/task/new");
    };

    return (
        <div className="mx-auto space-y-6 mb-10 max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-center text-white">My Tasks</h2>

            <div className="border-b border-gray-800 py-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleTabChange("owned")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition ${
                                    activeTab === "owned" ? "bg-accent-2 text-white" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FaUserEdit className="mr-2" />
                                Owned
                            </button>
                            <button
                                onClick={() => handleTabChange("assigned")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition ${
                                    activeTab === "assigned" ? "bg-accent-2 text-white" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FaUserCheck className="mr-2" />
                                Assigned
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-36">
                            <SelectField
                                labelText=""
                                options={sortOptions.map((opt, i) => ({
                                    id: i,
                                    name: `${opt.icon ? opt.icon.props.className ? '' : '' : ''} ${opt.name}`,
                                }))}
                                value={sortByIndex}
                                setValue={handleSortChange}
                            />
                        </div>
                        <div className="w-36 ml-1">
                            <SelectField
                                labelText=""
                                options={statusOptions}
                                value={filterBy}
                                setValue={handleFilterChange}
                            />
                        </div>
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
                    subtext={"Use the toolbar above to create a new task"}
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