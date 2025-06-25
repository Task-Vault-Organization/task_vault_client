import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";

export type CheckIfUserHasEmailConfirmationRequestsResponse = BaseApiResponse & {
    emailConfirmationRequestsExist: boolean
}