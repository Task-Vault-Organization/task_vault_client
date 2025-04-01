import { AxiosInstance } from 'axios';
import {getJwtToken} from "../../../shared/helpers/jwt-helpers.ts";

const authorizationRequestInterceptor = {
    use: (client: AxiosInstance) => {
        return client.interceptors.request.use(
            async request => {
                const token = getJwtToken();
                if (token) {
                    request.headers!['Authorization'] = 'Bearer ' + token;
                }
                return request;
            },
            error => {
                return Promise.reject(error);
            },
        );
    },
};

export default Object.freeze(authorizationRequestInterceptor);
