import { NotificationsApiClient } from "../../../api/clients/notification-api-client.ts";
import { GetNotification } from "../types/get-notification.ts";
import { create } from "zustand";

export interface NotificationState {
    notifications: GetNotification[],
    queue: GetNotification[],
    current: GetNotification | null,
    setCurrent: (notification: GetNotification | null) => void,
    addNotification: (notification: GetNotification) => void,
    setInitialNotifications: (initialNotifications: GetNotification[]) => void,
    shiftQueue: () => void,
    markAsSeenInStore: (id: string) => void,
    refetchNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    queue: [],
    current: null,
    setInitialNotifications: (initialNotifications: GetNotification[]) => {
        const existing = get().notifications;
        const merged = [
            ...initialNotifications.filter(n => !existing.some(e => e.id === n.id)),
            ...existing
        ];
        set({ notifications: merged });
    },
    addNotification: (notification: GetNotification) => {
        const state = get();
        if (!state.notifications.find(n => n.id === notification.id)) {
            const newQueue = [...state.queue, notification];
            const shouldShowNow = !state.current;

            set({
                notifications: [notification, ...state.notifications],
                queue: newQueue
            });

            if (shouldShowNow) {
                get().shiftQueue();
            }
        }
    },
    setCurrent: (notification) => set({ current: notification }),
    shiftQueue: () => {
        const state = get();
        const [next, ...rest] = state.queue;
        set({
            current: next || null,
            queue: rest
        });
    },
    markAsSeenInStore: (id: string) => {
        set(state => ({
            notifications: state.notifications.map(n =>
                n.id === id ? { ...n, notificationStatusId: 2 } : n
            ),
            current: state.current?.id === id ? { ...state.current, notificationStatusId: 2 } : state.current
        }));
    },
    refetchNotifications: async () => {
        try {
            const response = await NotificationsApiClient.getAllUserNotifications();
            set({ notifications: response.notifications });
        } catch (error) {
            console.error("Failed to refetch notifications", error);
        }
    }
}));