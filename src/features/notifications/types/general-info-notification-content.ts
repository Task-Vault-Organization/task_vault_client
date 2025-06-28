import {GetUser} from "../../../shared/types/get-user.ts";

export type GeneralInfoNotificationContent = {
    User: GetUser,
    Message: string,
    TargetLink?: string
}