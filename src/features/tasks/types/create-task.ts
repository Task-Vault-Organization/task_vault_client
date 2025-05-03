import {CreateTaskItem} from "./create-task-item.ts";

export type CreateTask = {
    title: string;
    description: string;
    deadlineAt?: Date | null;
    taskItems: CreateTaskItem[];
    assigneesIds?: string[] | null;
};