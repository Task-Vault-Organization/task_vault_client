import { FC } from "react";
import { GetNotification } from "../types/get-notification";
import { AcceptFileShareNotificationContent } from "../types/accept-file-share-notification-content";
import { NotificationsApiClient } from "../../../api/clients/notification-api-client.ts";
import {ResolveFileShareRequest} from "../../file-storage/types/resolve-file-share-request.ts";
import {FileStorageApiClient} from "../../../api/clients/file-storage-api-client.ts";

interface Props {
    notification: GetNotification;
    isLast?: boolean;
}

export const NotificationCard: FC<Props> = ({ notification, isLast = false }) => {
    const handleAccept = async (fileShareRequestId: string) => {
        try {
            const request: ResolveFileShareRequest = {
                fileShareRequestId,
                responseStatusId: 2
            }
            await FileStorageApiClient.resolveFileShareRequest(request);
            await NotificationsApiClient.markNotificationAsSeen(notification.id);
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleDecline = async (fileShareRequestId: string) => {
        try {
            const request: ResolveFileShareRequest = {
                fileShareRequestId,
                responseStatusId: 3
            }
            await FileStorageApiClient.resolveFileShareRequest(request);
            await NotificationsApiClient.markNotificationAsSeen(notification.id);
        } catch (error: any) {
            console.error(error);
        }
    };

    const formattedDate = new Date(notification.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const baseClasses = "w-full max-w-3xl text-sm text-gray-800 dark:text-gray-100 space-y-4";
    const borderClasses = isLast ? "" : "border-b border-gray-200 dark:border-gray-700 pb-4";

    if (notification.notificationTypeId === 1) {
        const parsed: AcceptFileShareNotificationContent = JSON.parse(notification.contentJson);

        return (
            <div className={`${baseClasses} ${borderClasses}`}>
                <p>
                    <strong>{parsed.User?.Email}</strong> invited you to access the file: <strong>{parsed.File?.Name}</strong>
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleAccept(parsed.FileShareRequestId)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleDecline(parsed.FileShareRequestId)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                        Decline
                    </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                    Received on {formattedDate}
                </div>
            </div>
        );
    }
};