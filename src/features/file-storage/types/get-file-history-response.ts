import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {FileHistoryLog} from "./file-history-log.ts";

export type GetFileHistoryResponse = BaseApiResponse & {
    fileHistoryLogs: FileHistoryLog[]
}