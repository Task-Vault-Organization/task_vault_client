import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/24/outline";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CreateTask } from "../../types/create-task.ts";
import { CreateTaskItem } from "../../types/create-task-item.ts";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client.ts";
import { BaseApiResponse } from "../../../../shared/types/base-api-response.ts";
import { UsersApiClient } from "../../../../api/clients/user-api-client.ts";
import {UserSearchField} from "../../../../shared/components/reusable/search/search-users";
import { GetUser } from "../../../../shared/types/get-user.ts";
import { UsersList } from "../../../../shared/components/reusable/users/users-list";
import { Button } from "../../../../shared/components/reusable/buttons/button";
import { FormField } from "../../../../shared/components/forms/form-field";
import {TextAreaField} from "../../../../shared/components/forms/text-area-field";
import { SelectField } from "../../../../shared/components/forms/select-field";

const FILE_TYPES = [
    { id: 1, name: "Text", extension: "txt" },
    { id: 2, name: "JPEG Image", extension: "jpg" },
    { id: 3, name: "PNG Image", extension: "png" },
    { id: 4, name: "GIF Image", extension: "gif" },
    { id: 5, name: "PDF Document", extension: "pdf" },
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

    const addTaskItem = () => {
        setTask((prev) => ({
            ...prev,
            taskItems: [
                ...prev.taskItems,
                {
                    title: "",
                    description: null,
                    fileTypeId: 1,
                    fileCategoryId: 1,
                },
            ],
        }));
    };

    const removeTaskItem = (index: number) => {
        setTask((prev) => ({
            ...prev,
            taskItems: prev.taskItems.filter((_, i) => i !== index),
        }));
    };

    const handleTaskItemChange = (
        index: number,
        field: keyof CreateTaskItem,
        value: string | number
    ) => {
        setTask((prev) => {
            const updatedItems = [...prev.taskItems];
            updatedItems[index] = { ...updatedItems[index], [field]: value };
            return { ...prev, taskItems: updatedItems };
        });
    };

    const handleUserSelect = (user: GetUser) => {
        if (!selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers((prev) => [...prev, user]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!task.title.trim()) throw new Error("Task title is required");
            if (task.taskItems.length === 0) throw new Error("At least one task item is required");
            for (const item of task.taskItems) {
                if (!item.title.trim()) throw new Error("All task items must have a title");
            }

            const taskToSubmit = {
                ...task,
                assigneesIds: selectedUsers.map((user) => user.id),
            };

            const response: BaseApiResponse = await TasksApiClient.createTask(taskToSubmit);
            if (response) navigate("/tasks");
            else throw new Error(response.message || "Failed to create task");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto space-y-6 mb-10 max-w-3xl">
            <h2 className="text-2xl font-semibold text-center text-white">Create a New Task</h2>

            <form onSubmit={handleSubmit} className="space-y-6 px-4">
                <FormField
                    value={task.title}
                    setValue={(val) => setTask((prev) => ({ ...prev, title: val }))}
                    labelText="Task Title"
                    placeholder="Enter task title"
                />

                <TextAreaField
                    value={task.description || ""}
                    setValue={(val) => setTask((prev) => ({ ...prev, description: val }))}
                    labelText="Description"
                    placeholder="Enter task description"
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-white mb-1">Deadline</label>
                    <ReactDatePicker
                        selected={task.deadlineAt}
                        onChange={(date: Date | null) => setTask((prev) => ({ ...prev, deadlineAt: date }))}
                        dateFormat="MMM d, yyyy"
                        placeholderText="Select a deadline"
                        className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        calendarClassName="!bg-gray-800 !border-gray-700 !text-white"
                        popperClassName="z-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white mb-1">Assignees</label>
                    <div className="relative">
                        <UserSearchField onUserSelect={handleUserSelect} />
                    </div>
                    <div className={"my-5"}>
                        <UsersList users={selectedUsers} onRemoveUser={handleRemoveUser}  userRemovable={true}/>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Task Items</h3>
                        <Button type="button" onClick={addTaskItem}>
                            + Add Item
                        </Button>
                    </div>

                    {task.taskItems.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                            No task items yet. Click “Add Item” to begin.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {task.taskItems.map((item, index) => (
                                <div key={index} className="bg-gray-800 py-5 px-6 rounded-lg text-white shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold">Item #{index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeTaskItem(index)}
                                            className="text-red-400 hover:text-red-600"
                                            title="Remove item"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <FormField
                                        value={item.title}
                                        setValue={(val) => handleTaskItemChange(index, "title", val)}
                                        labelText="Item Title"
                                        placeholder="Enter item title"
                                    />

                                    <TextAreaField
                                        value={item.description || ""}
                                        setValue={(val) => handleTaskItemChange(index, "description", val)}
                                        labelText="Description"
                                        placeholder="Enter item description"
                                        rows={2}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectField
                                            labelText="File Type"
                                            options={FILE_TYPES.map(({ id, name, extension }) => ({
                                                id,
                                                name: `${name} (${extension})`,
                                            }))}
                                            value={item.fileTypeId}
                                            setValue={(val) => handleTaskItemChange(index, "fileTypeId", val)}
                                            placeholder="Select file type"
                                        />

                                        <SelectField
                                            labelText="File Category"
                                            options={FILE_CATEGORIES}
                                            value={item.fileCategoryId}
                                            setValue={(val) => handleTaskItemChange(index, "fileCategoryId", val)}
                                            placeholder="Select file category"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" onClick={() => navigate("/tasks")}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Task"}
                    </Button>
                </div>
            </form>
        </div>
    );
};