import { FC, useEffect } from "react";
import { useNotificationStore } from "../../stores/notifications-store.ts";
import { NotificationCard } from "../notification-card.tsx";
import { AnimatePresence, motion } from "framer-motion";

export const NotificationQueue: FC = () => {
    const current = useNotificationStore((state) => state.current);
    const next = useNotificationStore((state) => state.nextNotification);

    useEffect(() => {
        if (current) {
            const timeout = setTimeout(() => {
                next();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [current]);

    return (
        <div className="fixed bg-accent-2 bottom-5 left-5 flex flex-col-reverse items-start gap-2 z-50 pointer-events-none">
            <AnimatePresence>
                {current && (
                    <motion.div
                        key={current.id}
                        layout
                        className="w-[360px] max-w-[90vw] pointer-events-auto bg-accent-2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <NotificationCard notification={current} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};