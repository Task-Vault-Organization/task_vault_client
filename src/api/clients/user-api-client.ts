import { AxiosInstance, AxiosResponse } from 'axios';
import { BaseApiClient } from "../base/base-api-client.ts";
import { ReadApiClient } from "../base/read-api-client.ts";
import { CrudApiClient } from "../base/crud-api-client.ts";
import { SearchUsersResponse } from "../../shared/types/search-users-response.ts";
import { BaseApiResponse } from "../../shared/types/base-api-response.ts";

export const UsersApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const searchUsers = async (searchField: string): Promise<SearchUsersResponse> => {
        const response: AxiosResponse<SearchUsersResponse> = await client.get(`${urlPath}search/${searchField}`);
        return response.data;
    };

    const uploadProfilePhoto = async (photo: File): Promise<BaseApiResponse> => {
        const formData = new FormData();
        formData.append('profilePhoto', photo);

        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}profile-photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        searchUsers,
        uploadProfilePhoto
    };
})(BaseApiClient, 'users/');