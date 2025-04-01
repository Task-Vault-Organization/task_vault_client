import {AuthenticateUser} from "../types/authenticate-user.ts";
import {BaseApiResponse} from "../../../shared/types/base-api-response.ts";
import {AuthenticateUserResponse} from "../types/authenticate-user-response.ts";
import {AuthenticateApiClient} from "../../../api/clients/authenticate-api-client.ts";
import {showAlert} from "../../../shared/helpers/alerts-helpers.ts";
import {setJwtToken} from "../../../shared/helpers/jwt-helpers.ts";
import {useAlertsStore} from "../../../shared/stores/alerts-store.ts";
import {useAuthenticationStore} from "../stores/authentication-store.ts";
import {GetUserResponse} from "../../../shared/types/get-user-response.ts";
import {localStorageLogout} from "../../../shared/helpers/local-storage-helpers.ts";

export const AuthenticationService = (() => {
    const authenticateUser = async (authenticateUser: AuthenticateUser) => {
        const res: BaseApiResponse & AuthenticateUserResponse =
            await AuthenticateApiClient.authenticateUser(authenticateUser);
        if (res.jwtToken) {
            setJwtToken(res.jwtToken);
        }
        const resUser: GetUserResponse = await AuthenticateApiClient.getUser();
        if (resUser.user) {
            const { authenticateUserStore } = useAuthenticationStore.getState();
            authenticateUserStore(true, resUser.user, res.jwtToken);
        }
        showAlert('success', res.message);
    }

    const logoutUser = () => {
        localStorageLogout();
        const { logoutStore } = useAuthenticationStore.getState();
        logoutStore();
    }

    return {
        authenticateUser: authenticateUser,
        logoutUser: logoutUser
    }
})();