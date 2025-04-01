import {AlertType} from "./alert-type.ts";
import {Alert} from "../components/Alerts/alert";
import { v4 as uuid } from 'uuid';

export type Alert = {
    id: string,
    type: AlertType,
    msg: string,
    timerId?: number
}

export function createAlert(type: AlertType, msg: string) : Alert {
    return {
        id: uuid(),
        type,
        msg
    }
}