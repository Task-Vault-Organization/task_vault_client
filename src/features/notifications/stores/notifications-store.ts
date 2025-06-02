import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GetNotification } from "../types/get-notification.ts";

interface NotificationStore {
    queue: GetNotification[];
    current: GetNotification | null;
    addNotification: (notification: GetNotification) => void;
    enqueueNotification: (notification: GetNotification) => void;
    nextNotification: () => void;
    clearCurrent: () => void;
    initialNotifications: GetNotification[];
    setInitialNotifications: (notifications: GetNotification[]) => void;
}

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            queue: [],
            current: null,
            initialNotifications: [],

            addNotification: (notification: GetNotification) => {
                const state = get();

                const alreadyExists =
                    state.queue.some(n => n.id === notification.id) ||
                    (state.current?.id === notification.id);

                if (alreadyExists) return;

                set({
                    initialNotifications: [notification, ...state.initialNotifications],
                });

                get().enqueueNotification(notification);
            },

            enqueueNotification: (notification: GetNotification) => {
                const { current, queue } = get();

                if (!current) {
                    set({ current: notification });
                } else {
                    set({ queue: [...queue, notification] });
                }
            },

            nextNotification: () => {
                const { queue } = get();
                if (queue.length > 0) {
                    const [next, ...rest] = queue;
                    set({ current: next, queue: rest });
                } else {
                    set({ current: null });
                }
            },

            clearCurrent: () => set({ current: null }),

            setInitialNotifications: (notifications: GetNotification[]) =>
                set({ initialNotifications: notifications }),
        }),
        {
            name: "notification-store",
            partialize: (state) => ({
                queue: state.queue,
                current: state.current,
                initialNotifications: state.initialNotifications,
            }),
        }
    )
);