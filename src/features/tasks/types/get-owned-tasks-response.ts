import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetOwnedTask} from "./get-owned-task.ts";

export type GetOwnedTasksResponse = BaseApiResponse & {
    tasks: GetOwnedTask[]
}