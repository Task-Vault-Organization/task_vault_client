import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetTaskSubmission} from "./get-task-submission.ts";

export type GetTaskSubmissionResponse = BaseApiResponse & {
    submissions: GetTaskSubmission[]
}