import { AxiosInstance } from 'axios';
import HttpStatusCode from '../http-status-codes.ts';
import {AuthenticationService} from "../../../features/authentication/services/authentication-service.ts";

const authorizationResponseInterceptor = {
    use: (client: AxiosInstance) => {
        try {
            return client.interceptors.response.use(
                async response => {
                    if (response.status === HttpStatusCode.UNAUTHORIZED) {
                        AuthenticationService.logoutUser();
                    }
                    return response;
                },
                error => {
                    if (error.response && error.response.status === HttpStatusCode.UNAUTHORIZED) {
                        AuthenticationService.logoutUser();
                    }
                    return Promise.reject(error);
                },
            );
        } catch (error: any) {
            console.error(error)
            AuthenticationService.logoutUser();
        }
    },
};

export default Object.freeze(authorizationResponseInterceptor);
