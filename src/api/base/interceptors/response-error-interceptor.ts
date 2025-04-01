import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import {useAlertsStore} from "../../../shared/stores/alerts-store.ts";
import {ApiErrorResponse} from "../../../shared/types/api-error-response.ts";
import {showAlert} from "../../../shared/helpers/alerts-helpers.ts";

const responseErrorInterceptor = {
    use: (client: AxiosInstance) => {
        return client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                const errorResponse: ApiErrorResponse = error.response?.data;
                showAlert('error', errorResponse.detail || errorResponse.title);
                console.log('API Error:', error);
                return Promise.reject(error);
            },
        );
    },
};

export default Object.freeze(responseErrorInterceptor);