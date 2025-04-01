import {baseApiResponse} from "../../../shared/types/base-api-response.ts";

export type AuthenticateUserResponse = baseApiResponse & {
    jwtToken: string
}