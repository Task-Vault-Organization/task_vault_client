import {BaseApiResponse} from "./base-api-response.ts";
import {GetUser} from "./get-user.ts";

export type GetUserResponse = BaseApiResponse & {
    user: GetUser
}