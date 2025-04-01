import { AxiosInstance } from 'axios';
import HttpStatusCode from '../http-status-codes.ts';
import {AuthenticationService} from "../../../features/authentication/services/authentication-service.ts";

const authorizationResponseInterceptor = {
    use: (client: AxiosInstance) => {
        return client.interceptors.response.use(
            async response => {
                if (response.status === HttpStatusCode.UNAUTHORIZED) {
                    AuthenticationService.logoutUser();
                }
                return response;
            },
            error => {
                return Promise.reject(error);
            },
        );
    },
};

export default Object.freeze(authorizationResponseInterceptor);
