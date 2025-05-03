import {FileType} from "../../file-storage/types/file-type.ts";
import {FileCategory} from "../../../shared/types/file-category.ts";

export type GetTaskItem = {
    id: string;
    title: string;
    description?: string | null;
    taskId: string;
    fileTypeId: number;
    fileCategoryId: number;
    fileType?: FileType | null;
    fileCategory?: FileCategory | null;
};