import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetFile} from "./get-file.ts";

export type GetFilesByTypeResponse = BaseApiResponse & {
    files: GetFile[]
}