import {NotificationState, useNotificationStore} from "../stores/notifications-store";
import { NotificationCard } from "./notification-card";
import { GetNotification } from "../types/get-notification";

export const NotificationRenderer = () => {
    const notifications = useNotificationStore((state: NotificationState) => state.notifications);

    return (
        <>
            {notifications.length > 0 && (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] w-lg px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg custom-scroll">
                    {notifications.map((notification: GetNotification, index: number) => (
                        <NotificationCard
                            key={notification.id?.toString() || `notification-${index}`}
                            notification={notification}
                            isLast={index === notifications.length - 1}
                        />
                    ))}
                </div>
            )}
        </>
    );
};