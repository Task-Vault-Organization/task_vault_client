import {NavLink} from "react-router";
import {FC} from "react";
import {useAuthenticationStore} from "../../../../features/authentication/stores/authentication-store.ts";
import {AuthenticationState} from "../../../../features/authentication/types/authentication-state.ts";
import {AuthenticationService} from "../../../../features/authentication/services/authentication-service.ts";

export const NavigationMenu: FC = () => {
    const isAuthenticated = useAuthenticationStore((state: AuthenticationState) => state.isAuthenticated);
    return (
        <nav className="bg-blue-200 p-4 shadow-lg w-max w-svw">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <NavLink to="/" className="text-white text-2xl font-extrabold tracking-wide drop-shadow-md">Home Page</NavLink>
                </div>
                <div className="space-x-4">
                    {
                        isAuthenticated ?
                            <>
                                <NavLink to="/files" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition-all">My files</NavLink>
                                <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                                        onClick={AuthenticationService.logoutUser}
                                >
                                    Log Out
                                </button>
                            </> :
                            <>
                                <NavLink to="/login" className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all">Log In</NavLink>
                                <NavLink to="/sign-up" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition-all">Sign Up</NavLink>
                            </>
                    }
                </div>
            </div>
        </nav>
    );
};