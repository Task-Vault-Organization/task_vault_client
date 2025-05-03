import {GetTaskItemFile} from "./get-task-item-file.ts";

export type CreateTaskSubmission = {
    taskId: string;
    taskItemFiles: GetTaskItemFile[];
};