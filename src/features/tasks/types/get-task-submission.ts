import {GetFile} from "../../file-storage/types/get-file.ts";

export type GetTaskSubmission = {
    id: string,
    taskId: string,
    submittedById: string,
    submittedAt: string,
    dissaproveComment?: string

    taskItemFiles: GetTaskSubmissionFileDto[]
}

export type GetTaskSubmissionFileDto = GetFile & {
    taskItemId: string
}