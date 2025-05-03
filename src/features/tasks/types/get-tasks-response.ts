import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetTask} from "./get-task.ts";

export type GetTasksResponse = BaseApiResponse & {
    task: GetTask[]
}