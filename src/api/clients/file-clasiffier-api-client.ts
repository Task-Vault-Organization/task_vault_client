import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {GetUserResponse} from "../../shared/types/get-user-response.ts";

export const AuthenticateApiClient = ((client: AxiosInstance, urlPath: string = '') => {

    const getUser = async (): Promise<GetUserResponse> => {
        const response: AxiosResponse<GetUserResponse> =
            await client.get(`${urlPath}you`);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        getUser
    };
})(BaseApiClient, 'authenticate/');
