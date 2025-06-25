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
import {
    CheckIfUserHasEmailConfirmationRequestsResponse
} from "../../features/authentication/types/check-if-user-has-email-confirmation-requests-response.ts";
import {CreateUserResponse} from "../../features/authentication/types/create-user-response.ts";

export const AuthenticateApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const createUser = async (createUser: CreateUser): Promise<CreateUserResponse> => {
        const response: AxiosResponse<CreateUserResponse> =
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

    const checkEmailConfirmationRequests = async (userId: string): Promise<CheckIfUserHasEmailConfirmationRequestsResponse> => {
        const response: AxiosResponse<CheckIfUserHasEmailConfirmationRequestsResponse> =
            await client.get(`${urlPath}email-confirmation-request/${userId}`);
        return response.data;
    };

    const createEmailConfirmationRequest = async (userId: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> =
            await client.post(`${urlPath}email-confirmation-request/${userId}`);
        return response.data;
    };

    const verifyEmailConfirmationCode = async (userId: string, code: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> =
            await client.post(`${urlPath}verify-email-confirmation/${userId}/${code}`);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        createUser,
        authenticateUser,
        getUser,
        authenticateUserGoogle,
        checkEmailConfirmationRequests,
        createEmailConfirmationRequest,
        verifyEmailConfirmationCode
    };
})(BaseApiClient, 'authenticate/');
