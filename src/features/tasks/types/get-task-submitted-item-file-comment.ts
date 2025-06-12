import {GetUser} from "../../../shared/types/get-user.ts";

export type GetTaskSubmittedItemFileComment = {
    id: string,
    taskSubmissionId: string,
    taskSubmissionTaskItemFileId: string,
    fromUserId: string,
    commentHtml: string,
    fromUser?: GetUser
}