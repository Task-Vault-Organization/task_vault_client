import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetFileShareDataUserItem} from "./get-file-share-data-user-item.ts";

export type GetFileShareDataResponse = BaseApiResponse & {
    items: GetFileShareDataUserItem[]
}