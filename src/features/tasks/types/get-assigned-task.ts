import {TaskStatus} from "../../../shared/types/task-status.ts";
import {GetTaskItem} from "./get-task-item.ts";
import {GetTaskSubmissionUser} from "./get-task-submission-user.ts";
import {GetAssignedTaskItem} from "./get-assigned-task-item.ts";
import {GetUser} from "../../../shared/types/get-user.ts";

export type GetAssignedTask = {
    id: string,
    title: string,
    description: string,
    ownerId: string,
    createdAt: Date,
    deadlineAt?: Date,
    statusId: string,
    status?: TaskStatus,
    approved?: boolean,
    noComments: number,
    taskItems: GetAssignedTaskItem[],
    assignees: GetTaskSubmissionUser[],
    owner?: GetUser,
    dissaprovedComment?: string
}