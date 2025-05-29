import {GetUser} from "../../../shared/types/get-user.ts";

export type FileHistoryLog = {
    loggedAt: Date,
    actionMadeBy?: GetUser,
    historyLog: string
}