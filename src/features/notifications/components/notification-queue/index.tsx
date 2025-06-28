import { FC, useEffect, useState } from "react";
import { useNotificationStore } from "../../stores/notifications-store.ts";
import { NotificationCard } from "../notification-card.tsx";
import { AnimatePresence, motion } from "framer-motion";

export const NotificationQueue: FC = () => {
    const { current, shiftQueue, refetchNotifications, setCurrent } = useNotificationStore();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!current) return;

        setVisible(true);

        const timeout = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                shiftQueue();
                refetchNotifications();
            }, 300);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [current]);

    return (
        <div className="fixed bottom-5 right-5 flex flex-col-reverse items-start gap-2 z-50 pointer-events-none">
            <AnimatePresence>
                {visible && current && (
                    <motion.div
                        key={current.id}
                        layout
                        className="w-[360px] max-w-[90vw] pointer-events-auto bg-accent-2 p-4 rounded-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onAnimationComplete={(definition) => {
                            if (definition === "exit") {
                                setCurrent(null);
                            }
                        }}
                    >
                        <NotificationCard notification={current} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};