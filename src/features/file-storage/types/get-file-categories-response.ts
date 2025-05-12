import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetFileCategory} from "./get-file-category.ts";

export type GetFileCategoriesResponse = BaseApiResponse & {
    fileCategories: GetFileCategory[]
}