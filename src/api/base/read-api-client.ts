import { AxiosInstance } from 'axios';
import {ModelBase} from "../../shared/types/model-base.ts";

/**
 * Api client base providing Read-only functionality.
 */
export const ReadApiClient = <TModel extends ModelBase<TId>, TId>(client: AxiosInstance, urlPath: string) => {
    return {
        /**
         * Get a result containing items, with optional filtering, sorting, and pagination.
         * @param params - Optional query parameters for filtering, sorting, and pagination.
         * @returns A promise that resolves to an object containing items and an optional count.
         */
        getAllAsync(): Promise<TModel[]> {
            return client.get<TModel[]>(urlPath).then(response => {
                return response.data;
            });
        },
        getOneAsync(id: TId): Promise<TModel> {
            return client.get<TModel>(`${urlPath}/${id}`).then(response => {
                return response.data;
            });
        },
    };
};
