import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";

export type AuthenticateUserResponse = BaseApiResponse & {
    jwtToken?: string,
    isEmailConfirmed: boolean,
    userId: string
}