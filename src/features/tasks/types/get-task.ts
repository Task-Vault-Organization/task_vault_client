import {GetUser} from "../../../shared/types/get-user.ts";
import {GetTaskItem} from "./get-task-item.ts";
import {TaskStatus} from "../../../shared/types/task-status.ts";

export type GetTask = {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    createdAt: Date;
    deadlineAt?: Date | null;
    statusId: number;
    status?: TaskStatus | null;
    assignees?: GetUser[] | null;
    taskItems?: GetTaskItem[] | null;
};