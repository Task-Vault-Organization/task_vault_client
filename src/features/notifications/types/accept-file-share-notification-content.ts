import {GetUser} from "../../../shared/types/get-user.ts";
import {GetFile} from "../../file-storage/types/get-file.ts";

export type AcceptFileShareNotificationContent  = {
    User: GetUser,
    File: GetFile,
    FileShareRequestId: string
}