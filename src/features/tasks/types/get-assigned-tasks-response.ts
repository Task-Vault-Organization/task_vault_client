import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetAssignedTask} from "./get-assigned-task.ts";

export type GetAssignedTasksResponse = BaseApiResponse & {
    tasks: GetAssignedTask[]
}