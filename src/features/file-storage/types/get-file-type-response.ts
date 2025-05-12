import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetFileType} from "./get-file-type.ts";

export type GetFileTypeResponse = BaseApiResponse & {
    fileTypes: GetFileType[]
}