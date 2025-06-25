import { AuthenticateUser } from "../types/authenticate-user.ts";
import { AuthenticateUserGoogle } from "../types/authenticate-user-google.ts";
import { CreateUser } from "../types/create-user.ts";
import { AuthenticateUserResponse } from "../types/authenticate-user-response.ts";
import { BaseApiResponse } from "../../../shared/types/base-api-response.ts";
import { GetUserResponse } from "../../../shared/types/get-user-response.ts";
import { AuthenticateApiClient } from "../../../api/clients/authenticate-api-client.ts";
import { showAlert } from "../../../shared/helpers/alerts-helpers.ts";
import { setJwtToken } from "../../../shared/helpers/jwt-helpers.ts";
import { localStorageLogout } from "../../../shared/helpers/local-storage-helpers.ts";
import { useAuthenticationStore } from "../stores/authentication-store.ts";
import {CreateUserResponse} from "../types/create-user-response.ts";

export const AuthenticationService = (() => {
    const handleAuthenticationSuccess = async (
        res: BaseApiResponse & AuthenticateUserResponse,
        navigate
    ) => {
        if (!res.isEmailConfirmed) {
            showAlert("info", "Email not confirmed");
            navigate(`/email-confirm/${res.userId}`);
        }

        if (res.jwtToken) {
            setJwtToken(res.jwtToken);
        }

        const resUser: GetUserResponse = await AuthenticateApiClient.getUser();
        if (resUser.user) {
            const { authenticateUserStore } = useAuthenticationStore.getState();
            authenticateUserStore(true, resUser.user, res.jwtToken);
        }

        showAlert("success", res.message);
    };

    const authenticateUser = async (authenticateUser: AuthenticateUser, navigate) => {
        const res = await AuthenticateApiClient.authenticateUser(authenticateUser);
        await handleAuthenticationSuccess(res, navigate);
    };

    const authenticateUserGoogle = async (authenticateUser: AuthenticateUserGoogle) => {
        const res = await AuthenticateApiClient.authenticateUserGoogle(authenticateUser);
        await handleAuthenticationSuccess(res);
    };

    const createUser = async (createUser: CreateUser, navigate) => {
        const res: CreateUserResponse = await AuthenticateApiClient.createUser(createUser);
        if (res.message) {
            showAlert("success", res.message);
            navigate(`/email-confirm/${res.userId}`)
        }
    };

    const logoutUser = () => {
        localStorageLogout();
        const { logoutStore } = useAuthenticationStore.getState();
        logoutStore();
    };

    return {
        authenticateUser,
        authenticateUserGoogle,
        createUser,
        logoutUser,
    };
})();