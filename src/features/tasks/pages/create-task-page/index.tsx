import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/24/outline";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { CreateTaskItem } from "../../types/create-task-item";
import { TasksApiClient } from "../../../../api/clients/tasks-api-client";
import { BaseApiResponse } from "../../../../shared/types/base-api-response";
import { CustomBgButton } from "../../../../shared/components/reusable/buttons/custom-bg-button";
import { Form } from "../../../../shared/components/forms/form";
import { FormFieldConfig } from "../../../../shared/components/forms/form";
import { FormField } from "../../../../shared/components/forms/form-field";
import { TextAreaField } from "../../../../shared/components/forms/text-area-field";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { AsyncSelectField } from "../../../../shared/components/forms/async-select-field";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface TaskFormData {
    title: string;
    description?: string;
}

export const CreateTaskPage: FC = () => {
    const navigate = useNavigate();
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [taskItems, setTaskItems] = useState<CreateTaskItem[]>([]);
    const [emailInputs, setEmailInputs] = useState<string[]>([""]);
    const [loading, setLoading] = useState<boolean>(false);

    const addTaskItem = () => {
        setTaskItems((prev) => [
            ...prev,
            {
                title: "",
                description: null,
                fileTypeId: 1,
                fileCategoryId: 1,
            },
        ]);
    };

    const removeTaskItem = (index: number) => {
        setTaskItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTaskItemChange = (
        index: number,
        field: keyof CreateTaskItem,
        value: string | number
    ) => {
        setTaskItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleEmailChange = (index: number, value: string) => {
        const updated = [...emailInputs];
        updated[index] = value;
        setEmailInputs(updated);
    };

    const handleAddEmailInput = () => {
        setEmailInputs([...emailInputs, ""]);
    };

    const handleRemoveEmailInput = (index: number) => {
        setEmailInputs(emailInputs.filter((_, i) => i !== index));
    };

    const fields: FormFieldConfig[] = [
        {
            name: "title",
            label: "Task Title",
            type: "text",
            placeholder: "Enter task title",
            validation: {
                required: "Task title is required",
                maxLength: {
                    value: 30,
                    message: "Title has a max length of 30"
                }
            },
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Enter task description",
            validation: {
                required: "Description is required",
                maxLength: {
                    value: 200,
                    message: "Description has a max length of 200"
                }
            },
        },
    ];

    const handleFormSubmit = async (data: TaskFormData) => {
        try {
            setLoading(true);
            const cleanedEmails = emailInputs
                .map((email) => email.trim().toLowerCase())
                .filter((email) => email);

            const taskToSubmit = {
                title: data.title,
                description: data.description,
                deadlineAt: deadline,
                taskItems,
                assigneesEmails: cleanedEmails.length > 0 ? cleanedEmails : null,
            };

            const response: BaseApiResponse = await TasksApiClient.createTask(taskToSubmit);
            if (response) {
                navigate("/tasks");
                showAlert("success", "Successfully added task");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto space-y-6 mb-10 max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-center text-white">Create a New Task</h2>
            <Form<TaskFormData>
                fields={fields}
                onSubmit={handleFormSubmit}
                submitLabel="Create Task"
                loading={loading}
            >
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-white mb-1">Deadline</label>
                    <div className="relative z-10">
                        <ReactDatePicker
                            selected={deadline}
                            onChange={setDeadline}
                            dateFormat="MMM d, yyyy"
                            placeholderText="Select a deadline"
                            className="w-full p-2.5 rounded-lg border border-gray-600 text-white bg-gray-900"
                            popperPlacement="bottom-start"
                            popperClassName="z-[100]"
                            portalId="datepicker-portal"
                            calendarContainer={({ children }) => (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="z-50"
                                >
                                    <div className="react-datepicker bg-black border border-gray-700 text-white rounded-md shadow-lg">
                                        {children}
                                    </div>
                                </motion.div>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white mb-1">Assignees</label>
                    {emailInputs.map((email, idx) => {
                        const normalized = email.trim().toLowerCase();
                        const isDuplicate = normalized && emailInputs.filter(
                            (e) => e.trim().toLowerCase() === normalized
                        ).length > 1;
                        return (
                            <div key={idx} className="flex gap-2 items-center w-full">
                                <div className="flex-grow">
                                    <FormField
                                        value={email}
                                        setValue={(val) => handleEmailChange(idx, val)}
                                        placeholderText={"Assignee email"}
                                        type="email"
                                        required
                                        error={isDuplicate ? { message: "Duplicate email" } : undefined}
                                     />
                                </div>
                                {emailInputs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEmailInput(idx)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    <button
                        type="button"
                        onClick={handleAddEmailInput}
                        className="text-sm text-white hover:text-blue-300 flex items-center gap-1"
                    >
                        <FiPlus /> Add another email
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">Task Items</h3>
                        <CustomBgButton type="button" onClick={addTaskItem}>
                            + Add Item
                        </CustomBgButton>
                    </div>

                    {taskItems.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                            No task items yet. Click “Add Item” to begin.
                        </div>
                    ) : (
                        taskItems.map((item, index) => (
                            <div key={index} className="bg-gray-800 py-6 px-4 sm:px-6 rounded-lg text-white shadow-md dark:border dark:border-gray-700">
                                <div className="flex justify-between items-start mb-5">
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
                                    labelText="Item Title"
                                    value={item.title}
                                    setValue={(val) => handleTaskItemChange(index, "title", val)}
                                    placeholder="Enter item title"
                                />

                                <TextAreaField
                                    value={item.description || ""}
                                    setValue={(val) => handleTaskItemChange(index, "description", val)}
                                    labelText="Description"
                                    placeholder="Enter item description"
                                    rows={2}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                    <AsyncSelectField
                                        labelText="File Type"
                                        placeholder="Select file type"
                                        value={item.fileTypeId}
                                        setValue={(val) => handleTaskItemChange(index, "fileTypeId", val)}
                                        fetchOptions={async () => {
                                            const res = await FileStorageApiClient.getFileTypes();
                                            return res.fileTypes.map(({ id, name, extension }) => ({
                                                id,
                                                name: `${name} (${extension})`,
                                            }));
                                        }}
                                    />

                                    <AsyncSelectField
                                        labelText="File Category"
                                        placeholder="Select file category"
                                        value={item.fileCategoryId}
                                        setValue={(val) => handleTaskItemChange(index, "fileCategoryId", val)}
                                        fetchOptions={async () => {
                                            const res = await FileStorageApiClient.getFileCategories();
                                            return res.fileCategories;
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Form>
        </div>
    );
};