import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CreateTask } from "../../types/create-task.ts";
import { CreateTaskItem } from "../../types/create-task-item.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";
import { BaseApiResponse } from "../../../../shared/types/base-api-response.ts";
import { UsersApiClient } from "../../../../api/clients/user-api-client.ts";
import { SearchUsers } from "../../../../shared/components/reusable/search/search-users";
import { GetUser } from "../../../../shared/types/get-user.ts";
import {UsersList} from "../../../../shared/components/reusable/users/users-list";

const FILE_TYPES = [
    { id: 1, name: "Text", extension: "txt", mimeType: "text/plain" },
    { id: 2, name: "JPEG Image", extension: "jpg", mimeType: "image/jpeg" },
    { id: 3, name: "PNG Image", extension: "png", mimeType: "image/png" },
    { id: 4, name: "GIF Image", extension: "gif", mimeType: "image/gif" },
    { id: 5, name: "PDF Document", extension: "pdf", mimeType: "application/pdf" },
];

const FILE_CATEGORIES = [
    { id: 1, name: "Document" },
    { id: 2, name: "Image" },
    { id: 3, name: "Reference" },
    { id: 4, name: "Attachment" },
];

export const CreateTaskPage: FC = () => {
    const navigate = useNavigate();
    const [task, setTask] = useState<CreateTask>({
        title: "",
        description: "",
        deadlineAt: null,
        taskItems: [],
        assigneesIds: null,
    });
    const [selectedUsers, setSelectedUsers] = useState<GetUser[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask(prev => ({ ...prev, deadlineAt: e.target.value ? new Date(e.target.value) : null }));
    };

    const addTaskItem = () => {
        setTask(prev => ({
            ...prev,
            taskItems: [
                ...prev.taskItems,
                {
                    title: "",
                    description: null,
                    fileTypeId: 1,
                    fileCategoryId: 1
                },
            ],
        }));
    };

    const removeTaskItem = (index: number) => {
        setTask(prev => ({
            ...prev,
            taskItems: prev.taskItems.filter((_, i) => i !== index),
        }));
    };

    const handleTaskItemChange = (
        index: number,
        field: keyof CreateTaskItem,
        value: string | number
    ) => {
        setTask(prev => {
            const updatedItems = [...prev.taskItems];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            return { ...prev, taskItems: updatedItems };
        });
    };

    const handleUserSelect = (user: GetUser) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(user => user.id !== userId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!task.title.trim()) {
                throw new Error("Task title is required");
            }

            if (task.taskItems.length === 0) {
                throw new Error("At least one task item is required");
            }

            for (const item of task.taskItems) {
                if (!item.title.trim()) {
                    throw new Error("All task items must have a title");
                }
            }

            const taskToSubmit = {
                ...task,
                assigneesIds: selectedUsers.map(user => user.id)
            };

            const response: BaseApiResponse = await TasksApiClient.createTask(taskToSubmit);
            if (response) {
                navigate("/tasks");
            } else {
                throw new Error(response.message || "Failed to create task");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 shadow-xl rounded-2xl p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-200 mb-6">Create New Task</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={task.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={task.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadlineAt" className="block text-sm font-medium text-gray-200 mb-1">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            id="deadlineAt"
                            name="deadlineAt"
                            onChange={handleDateChange}
                            className="text-gray-200 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="py-4">
                    <SearchUsers
                        onUserSelect={handleUserSelect}
                        apiClient={UsersApiClient}
                        placeholder="Find a user..."
                        className="mb-2"
                    />
                    <div className={"py-3"}>
                        <UsersList
                            users={selectedUsers}
                            onRemoveUser={handleRemoveUser}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-200">Task Items</h2>
                        <button
                            type="button"
                            onClick={addTaskItem}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add Item</span>
                        </button>
                    </div>

                    {task.taskItems.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            No task items added yet. Click "Add Item" to create one.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {task.taskItems.map((item, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-accent-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-medium text-gray-200">Item #{index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeTaskItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove item"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor={`item-title-${index}`} className="block text-sm font-medium text-gray-200 mb-1">
                                                Item Title *
                                            </label>
                                            <input
                                                type="text"
                                                id={`item-title-${index}`}
                                                value={item.title}
                                                onChange={(e) => handleTaskItemChange(index, "title", e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`item-description-${index}`} className="block text-sm font-medium text-gray-200 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                id={`item-description-${index}`}
                                                value={item.description || ""}
                                                onChange={(e) => handleTaskItemChange(index, "description", e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor={`item-fileType-${index}`} className="block text-sm font-medium text-gray-200 mb-1">
                                                    File Type *
                                                </label>
                                                <select
                                                    id={`item-fileType-${index}`}
                                                    value={item.fileTypeId}
                                                    onChange={(e) => handleTaskItemChange(index, "fileTypeId", parseInt(e.target.value))}
                                                    className="text-gray-200 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    {FILE_TYPES.map((type) => (
                                                        <option className={"text-gray-800"} key={type.id} value={type.id}>
                                                            {type.name} ({type.extension})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor={`item-fileCategory-${index}`} className="block text-sm font-medium text-gray-200 mb-1">
                                                    File Category *
                                                </label>
                                                <select
                                                    id={`item-fileCategory-${index}`}
                                                    value={item.fileCategoryId}
                                                    onChange={(e) => handleTaskItemChange(index, "fileCategoryId", parseInt(e.target.value))}
                                                    className="text-gray-200 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    {FILE_CATEGORIES.map((category) => (
                                                        <option className={"text-gray-800"} key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-100 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/tasks")}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-200 hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </form>
        </div>
    );
};