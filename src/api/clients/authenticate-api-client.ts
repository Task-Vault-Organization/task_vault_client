import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiResponse} from "../../shared/types/base-api-response.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {CreateUser} from "../../features/authentication/types/create-user.ts";
import {AuthenticateUser} from "../../features/authentication/types/authenticate-user.ts";
import {AuthenticateUserResponse} from "../../features/authentication/types/authenticate-user-response.ts";
import {GetUserResponse} from "../../shared/types/get-user-response.ts";
import {AuthenticateUserGoogle} from "../../features/authentication/types/authenticate-user-google.ts";

export const AuthenticateApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const createUser = async (createUser: CreateUser): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> =
            await client.post(`${urlPath}create-user`, createUser);
            return response.data;
    };

    const authenticateUser = async (authenticateUser: AuthenticateUser): Promise<AuthenticateUserResponse> => {
        const response: AxiosResponse<AuthenticateUserResponse> =
            await client.post(`${urlPath}`, authenticateUser);
            return response.data;
    };

    const authenticateUserGoogle = async (authenticateUserGoogle: AuthenticateUserGoogle): Promise<AuthenticateUserResponse> => {
        const response: AxiosResponse<AuthenticateUserResponse> =
            await client.post(`${urlPath}google`, authenticateUserGoogle);
        return response.data;
    };

    const getUser = async (): Promise<GetUserResponse> => {
        const response: AxiosResponse<GetUserResponse> =
            await client.get(`${urlPath}you`);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        createUser,
        authenticateUser,
        getUser,
        authenticateUserGoogle
    };
})(BaseApiClient, 'authenticate/');
