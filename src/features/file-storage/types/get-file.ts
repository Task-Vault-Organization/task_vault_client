import {FileType} from "./file-type.ts";
import {GetUser} from "../../../shared/types/get-user.ts";

export type GetFile = {
    id: string,
    size: number,
    name: string,
    uploaderId: string,
    uploadedAt: Date,
    isDirectory: boolean,
    directoryId?: string,
    fileTypeId: number,
    fileType: FileType | null,
    uploader: GetUser | null,
    owners: GetUser[] | null
}