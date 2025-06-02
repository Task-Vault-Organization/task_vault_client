import {GetUser} from "../../../shared/types/get-user.ts";
import {NotificationType} from "./notification-type.ts";
import {NotificationStatus} from "./notification-status.ts";

export type GetNotification = {
    id: string,
    toId: string,
    createdAt: Date,
    contentJson: string,
    notificationTypeId: number,
    notificationStatusId: number,
    toUser?: GetUser,
    notificationType?: NotificationType
    notificationStatus?: NotificationStatus
}