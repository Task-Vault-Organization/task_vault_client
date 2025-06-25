import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";

export type CreateUserResponse = BaseApiResponse & {
    userId: string
}