import axios from 'axios';
import {AuthorizationRequestInterceptor, ResponseErrorInterceptor,} from './interceptors';
import config from '../../config/config.json';

export const defaultHeaders = {
    'Content-Type': 'application/json',
};

export const BaseApiClient = axios.create({
    baseURL: `${config.API_BASE_URL}`,
    headers: defaultHeaders,
});

AuthorizationRequestInterceptor.use(BaseApiClient);
ResponseErrorInterceptor.use(BaseApiClient);