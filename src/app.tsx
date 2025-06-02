import './app.css';
import { AlertList } from "./shared/components/Alerts/alert-list";
import { NavigationMenu } from "./shared/layouts/Navigation/navigation-menu";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuthenticationStore } from "./features/authentication/stores/authentication-store";
import { AuthenticationState } from "./features/authentication/types/authentication-state";
import {NotificationQueue} from "./features/notifications/components/notification-queue";

function App() {
    const token = useAuthenticationStore((state: AuthenticationState) => state.jwtToken);

    return (
        <>
            <AlertList />
            <NavigationMenu />
            <NotificationQueue />
            <div className="pt-20">
                <Outlet />
            </div>
        </>
    );
}

export default App;