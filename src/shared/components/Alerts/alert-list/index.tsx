import { FC } from "react";
import { useAlertsStore } from "../../../stores/alerts-store.ts";
import { Alert as AlertType } from "../../../types/alert.ts";
import { Alert } from "../alert";
import { AnimatePresence, motion } from "framer-motion";

export const AlertList: FC = () => {
    const alerts = useAlertsStore((state) => state.alerts);

    return (
        <div className="fixed bottom-5 left-5 flex flex-col-reverse items-start gap-2 z-50 pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert: AlertType) => (
                    <motion.div
                        key={alert.id}
                        layout
                        className="min-w-[600px] w-fit max-w-[90vw] pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Alert alert={alert} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};