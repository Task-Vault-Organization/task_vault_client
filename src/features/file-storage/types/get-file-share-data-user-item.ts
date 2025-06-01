import {FileShareRequestStatus} from "./file-share-request-status.ts";

export type GetFileShareDataUserItem = {
    userId: string,
    userEmail: string,
    status?: FileShareRequestStatus
}