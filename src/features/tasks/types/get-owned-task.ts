import {TaskStatus} from "../../../shared/types/task-status.ts";
import {GetTaskItem} from "./get-task-item.ts";

export type GetOwnedTask = {
    id: string,
    title: string,
    description: string,
    ownerId: string,
    createdAt: Date,
    deadlineAt?: Date,
    statusId: string,
    status?: TaskStatus,
    taskItems: GetTaskItem[]
}