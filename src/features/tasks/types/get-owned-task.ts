import {TaskStatus} from "../../../shared/types/task-status.ts";
import {GetTaskItem} from "./get-task-item.ts";
import {GetUser} from "../../../shared/types/get-user.ts";

export type GetOwnedTask = {
    id: string,
    title: string,
    description: string,
    ownerId: string,
    createdAt: Date,
    deadlineAt?: Date,
    statusId: string,
    status?: TaskStatus,
    taskItems: GetTaskItem[],
    owner?: GetUser
}