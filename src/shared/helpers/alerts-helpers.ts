import {useAlertsStore} from "../stores/alerts-store.ts";

export const showAlert = (type, msg) => {
    const { showAlert } = useAlertsStore.getState();
    showAlert(type, msg);
}