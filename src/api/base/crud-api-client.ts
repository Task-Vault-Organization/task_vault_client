import { AxiosInstance } from 'axios';
import HttpStatusCode from './http-status-codes.ts';
import {ModelBase} from "../../shared/types/model-base.ts";
import { ReadApiClient } from './read-api-client.ts';

/**
 * Api client base providing CRUD functionality.
 */
export const CrudApiClient = <TModel extends ModelBase<TId>, TId>(client: AxiosInstance, urlPath: string) =>
    Object.assign(
        {
            /**
             * Create a new item based on model.
             */
            createAsync(item: TModel): Promise<TModel> {
                return client.post<TModel>(urlPath, item).then(response => response.data);
            },

            /**
             * Update an existing item based on id and model.
             */
            updateAsync(item: TModel): Promise<TModel> {
                return client.put<TModel>(urlPath + '/' + item.id, item).then(response => response.data);
            },

            /**
             * Delete an existing item based on id.
             */
            deleteAsync(id: TId): Promise<boolean> {
                return client
                    .delete<boolean>(urlPath + '/' + id)
                    .then(response => response.status === HttpStatusCode.NO_CONTENT);
            },
        },
        ReadApiClient<TModel, TId>(client, urlPath),
    );
