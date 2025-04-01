import { create, StoreApi } from "zustand";
import { AlertsState } from "../types/alerts-state.ts";
import { Alert, createAlert } from "../types/alert.ts";
import { AlertType } from "../types/alert-type.ts";
import config from '../../config/config.json';

export const useAlertsStore: StoreApi<AlertsState> = create<AlertsState>((set) => ({
    alerts: [],
    showAlert: (type: AlertType, msg: string) => {
        const alert = createAlert(type, msg);

        const timerId = window.setTimeout(() => {
            set((state: AlertsState) => ({
                alerts: state.alerts.filter((a: Alert) => a.id !== alert.id)
            }));
        }, config.ALERTS_TIMEOUT);

        set((state) => ({
            alerts: [...state.alerts, { ...alert, timerId }]
        }));

        return alert.id;
    },
    removeAlert: (id: string) => set((state: AlertsState) => {
        const alertToRemove = state.alerts.find((alert: Alert) => alert.id === id);
        if (alertToRemove?.timerId) {
            window.clearTimeout(alertToRemove.timerId);
        }

        return {
            alerts: state.alerts.filter((alert: Alert) => alert.id !== id)
        };
    })
}));