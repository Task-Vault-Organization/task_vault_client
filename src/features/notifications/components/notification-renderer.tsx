import { useEffect } from "react";
import { useNotificationStore } from "../stores/notifications-store";
import { NotificationCard } from "./notification-card";
import { NotificationsApiClient } from "../../../api/clients/notification-api-client.ts";
import { GetNotification } from "../types/get-notification";

export const NotificationRenderer = () => {
    const initialNotifications = useNotificationStore(state => state.initialNotifications);
    const setInitialNotifications = useNotificationStore(state => state.setInitialNotifications);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const result = await NotificationsApiClient.getAllUserNotifications();
                const notifications = result.notifications || [];
                setInitialNotifications(notifications);
            } catch (e) {
                console.error("Failed to fetch initial notifications", e);
            }
        };
        loadNotifications();
    }, []);

    return (
        <>
            {initialNotifications.length > 0 && (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] w-lg px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg custom-scroll">
                    {initialNotifications.map((notification: GetNotification, index: number) => (
                        <NotificationCard
                            key={notification.id?.toString() || `notification-${index}`}
                            notification={notification}
                            isLast={index === initialNotifications.length - 1}
                        />
                    ))}
                </div>
            )}
        </>
    );
};