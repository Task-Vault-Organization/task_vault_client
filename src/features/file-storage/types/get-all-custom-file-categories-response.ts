import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {CustomFileCategory} from "./custom-file-category.ts";

export type GetAllCustomFileCategoriesResponse = BaseApiResponse & {
    customFileCategories: CustomFileCategory[]
}