import {FileType} from "../../file-storage/types/file-type.ts";
import {FileCategory} from "../../../shared/types/file-category.ts";
import {GetFile} from "../../file-storage/types/get-file.ts";
import {GetTaskSubmittedItemFileComment} from "./get-task-submitted-item-file-comment.ts";

export type GetAssignedTaskItem = {
    id: string,
    title: string,
    description?: string,
    taskId: string,
    fileTypeId: string,
    fileCategoryId: string,
    fileType?: FileType,
    fileCategory?: FileCategory,
    submittedFile?: GetFile,
    comments: GetTaskSubmittedItemFileComment[]
}