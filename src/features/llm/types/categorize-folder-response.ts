import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";

export type CategorizeFolderResponse = BaseApiResponse & {
    categorizedFileIds: Record<string, string[]>
}