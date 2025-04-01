import {FC, ReactNode} from "react";
import {useAuthenticationStore} from "../../../../features/authentication/stores/authentication-store.ts";
import {AuthenticationState} from "../../../../features/authentication/types/authentication-state.ts";
import {Navigate, redirect, useLocation} from "react-router";

interface ProtectedRouteProps {
    children: ReactNode
}

export const ProtectedRoute : FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useAuthenticationStore((state: AuthenticationState) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to='/login' state={{ from: location }} replace />;
    return children;
}