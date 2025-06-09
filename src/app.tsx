import './app.css';
import { AlertList } from "./shared/components/Alerts/alert-list";
import { NavigationMenu } from "./shared/layouts/Navigation/navigation-menu";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuthenticationStore } from "./features/authentication/stores/authentication-store";
import { AuthenticationState } from "./features/authentication/types/authentication-state";
import { NotificationQueue } from "./features/notifications/components/notification-queue";
import { GetAllUserNotificationResponse } from "./features/notifications/types/get-all-user-notification-response.ts";
import { NotificationsApiClient } from "./api/clients/notification-api-client.ts";
import { NotificationState, useNotificationStore } from "./features/notifications/stores/notifications-store.ts";
import { startSignalRConnection } from "./features/notifications/services/signalr-service.ts";
import {GoogleOAuthProvider} from "@react-oauth/google";
import config from "./config/config.json";

function App() {
    const token = useAuthenticationStore((state: AuthenticationState) => state.jwtToken);
    const setNotifications = useNotificationStore((state: NotificationState) => state.setInitialNotifications);

    const fetchNotifications = async () => {
        try {
            const res: GetAllUserNotificationResponse = await NotificationsApiClient.getAllUserNotifications();
            setNotifications(res.notifications);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            if (token) {
                await startSignalRConnection(token);
                await fetchNotifications();
            }
        };
        initialize();
    }, [token]);

    return (
        <GoogleOAuthProvider clientId={config.GOOGLE_OAUTH_CLIENT_ID}>
            <AlertList />
            <NavigationMenu />
            <NotificationQueue />
            <div className="pt-20">
                <Outlet />
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;