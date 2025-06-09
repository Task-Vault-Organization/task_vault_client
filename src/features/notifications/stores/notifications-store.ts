import { create } from "zustand";
import { GetNotification } from "../types/get-notification.ts";

export interface NotificationState {
    notifications: GetNotification[],
    queue: GetNotification[],
    current: GetNotification | null,
    addNotification: (notification: GetNotification) => void,
    setInitialNotifications: (initialNotifications: GetNotification[]) => void,
    shiftQueue: () => void
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
    shiftQueue: () => {
        const state = get();
        const [next, ...rest] = state.queue;
        set({
            current: next || null,
            queue: rest
        });
    }
}));