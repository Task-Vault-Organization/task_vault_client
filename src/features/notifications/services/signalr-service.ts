import * as signalR from "@microsoft/signalr";
import config from '../../../config/config.json';
import { useNotificationStore } from "../stores/notifications-store.ts";
import { GetNotification } from "../types/get-notification.ts";

let connection: signalR.HubConnection | null = null;
let isConnected = false;

function keysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamelCase(v));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result: any, key: string) => {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = keysToCamelCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
}

export async function startSignalRConnection(token: string): Promise<void> {
    if (connection && isConnected) return;

    connection = new signalR.HubConnectionBuilder()
        .withUrl(config.SIGNALR_BASE_URL, {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: retryContext => {
                const delays = [0, 2000, 5000, 10000];
                return delays[retryContext.previousRetryCount] ?? null;
            }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveNotification", (message: string) => {
        try {
            const rawNotification = JSON.parse(message);
            const notification: GetNotification = keysToCamelCase(rawNotification);
            const { addNotification } = useNotificationStore.getState();
            addNotification(notification);
            console.log(notification);
        } catch (error) {
            console.error("Error parsing notification", error);
        }
    });

    connection.onreconnecting(() => {
        isConnected = false;
    });

    connection.onreconnected(() => {
        isConnected = true;
    });

    connection.onclose(() => {
        isConnected = false;
    });

    try {
        await connection.start();
        isConnected = true;
        console.log("✅ SignalR Connected");
    } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
    }
}

export async function stopSignalRConnection(): Promise<void> {
    if (connection && isConnected) {
        try {
            await connection.stop();
            isConnected = false;
            console.log("🔌 SignalR Disconnected");
        } catch (err) {
            console.error("❌ Error disconnecting SignalR:", err);
        }
    }
}