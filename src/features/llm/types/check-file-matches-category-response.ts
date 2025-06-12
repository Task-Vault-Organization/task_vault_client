import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";

export type CheckFileMatchesCategoryResponse = BaseApiResponse & {
    matchPercentage: number
}