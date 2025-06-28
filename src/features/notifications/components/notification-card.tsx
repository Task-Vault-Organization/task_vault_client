import { FC } from "react";
import { GetNotification } from "../types/get-notification";
import { AcceptFileShareNotificationContent } from "../types/accept-file-share-notification-content";
import { GeneralInfoNotificationContent } from "../types/general-info-notification-content";
import { NotificationsApiClient } from "../../../api/clients/notification-api-client.ts";
import { ResolveFileShareRequest } from "../../file-storage/types/resolve-file-share-request.ts";
import { FileStorageApiClient } from "../../../api/clients/file-storage-api-client.ts";
import { useFilesStore } from "../../file-storage/stores/files-store.ts";
import { useNotificationStore } from "../stores/notifications-store.ts";
import { Check, MailCheck } from "lucide-react";
import { Link } from "react-router";

interface Props {
    notification: GetNotification;
    isLast?: boolean;
}

export const NotificationCard: FC<Props> = ({ notification, isLast = false }) => {
    const fetchFiles = useFilesStore(state => state.fetchFiles);
    const { markAsSeenInStore } = useNotificationStore();

    const handleAccept = async (fileShareRequestId: string) => {
        await FileStorageApiClient.resolveFileShareRequest({
            fileShareRequestId,
            responseStatusId: 2
        });
        await NotificationsApiClient.markNotificationAsSeen(notification.id);
        markAsSeenInStore(notification.id);
        fetchFiles();
    };

    const handleDecline = async (fileShareRequestId: string) => {
        await FileStorageApiClient.resolveFileShareRequest({
            fileShareRequestId,
            responseStatusId: 3
        });
        await NotificationsApiClient.markNotificationAsSeen(notification.id);
        markAsSeenInStore(notification.id);
    };

    const handleMarkAsSeen = async () => {
        await NotificationsApiClient.markNotificationAsSeen(notification.id);
        markAsSeenInStore(notification.id);
    };

    const formattedDate = new Date(notification.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const isRead = notification.notificationStatusId === 2;
    const baseClasses = "relative w-full max-w-3xl text-sm space-y-4 text-gray-800 dark:text-gray-100";
    const borderClasses = isLast ? "" : "border-b border-gray-200 dark:border-gray-700 pb-4";
    const containerClasses = `${baseClasses} ${borderClasses}`;

    if (notification.notificationTypeId === 1) {
        const parsed: AcceptFileShareNotificationContent = JSON.parse(notification.contentJson);

        return (
            <div className={containerClasses}>
                <div className="relative z-10 flex flex-col">
                    <p>
                        <strong>{parsed.User?.Email}</strong> invited you to access the file: <strong>{parsed.File?.Name}</strong>
                    </p>

                    {!isRead && (
                        <div className="flex gap-4 mt-2">
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
                    )}

                    {isRead && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">Seen</div>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                        Received on {formattedDate}
                    </div>
                </div>

                {!isRead && (
                    <button
                        onClick={handleMarkAsSeen}
                        className="absolute top-2 right-2 text-gray-400 hover:text-green-400 z-30"
                        title="Mark as read"
                    >
                        <Check size={16} />
                    </button>
                )}

                {isRead && (
                    <>
                        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 rounded-lg z-20 pointer-events-none" />
                        <div
                            className="absolute bottom-2 right-2 text-gray-500 z-30"
                            title="Read notification"
                        >
                            <MailCheck size={24} />
                        </div>
                    </>
                )}
            </div>
        );
    }

    if (notification.notificationTypeId === 2) {
        const parsed: GeneralInfoNotificationContent = JSON.parse(notification.contentJson);

        return parsed.TargetLink ? (
            <Link to={parsed.TargetLink} className={containerClasses}>
                <div className="relative z-10 flex flex-col">
                    <p>
                        <strong>Message from: {parsed.User.Email}</strong>
                    </p>
                    <p className="mt-1">{parsed.Message}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                        Received on {formattedDate}
                    </div>
                </div>

                {!isRead && (
                    <div
                        onClick={handleMarkAsSeen}
                        className="absolute top-2 right-2 text-gray-400 hover:text-green-400 z-30"
                        title="Mark as read"
                    >
                        <Check size={16} />
                    </div>
                )}

                {isRead && (
                    <>
                        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 rounded-lg z-20 pointer-events-none" />
                        <div
                            className="absolute bottom-2 right-2 text-gray-500 z-30"
                            title="Read notification"
                        >
                            <MailCheck size={24} />
                        </div>
                    </>
                )}
            </Link>
        ) : (
            <div className={containerClasses}>
                <div className="relative z-10 flex flex-col">
                    <p>
                        <strong>Message from: {parsed.User.Email}</strong>
                    </p>
                    <p className="mt-1">{parsed.Message}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                        Received on {formattedDate}
                    </div>
                </div>

                {!isRead && (
                    <button
                        onClick={handleMarkAsSeen}
                        className="absolute top-2 right-2 text-gray-400 hover:text-green-400 z-30"
                        title="Mark as read"
                    >
                        <Check size={16} />
                    </button>
                )}

                {isRead && (
                    <>
                        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 rounded-lg z-20 pointer-events-none" />
                        <div
                            className="absolute bottom-2 right-2 text-gray-500 z-30"
                            title="Read notification"
                        >
                            <MailCheck size={24} />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return null;
};