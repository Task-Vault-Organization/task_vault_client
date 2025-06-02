import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {GetNotification} from "./get-notification.ts";

export type GetAllUserNotificationResponse = BaseApiResponse & {
    notifications: GetNotification[]
}