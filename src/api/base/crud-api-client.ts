import { AxiosInstance } from 'axios';
import HttpStatusCode from './http-status-codes.ts';
import {ModelBase} from "../../shared/types/model-base.ts";
import { ReadApiClient } from './read-api-client.ts';

export const CrudApiClient = <TModel extends ModelBase<TId>, TId>(client: AxiosInstance, urlPath: string) =>
    Object.assign(
        {
            createAsync(item: TModel): Promise<TModel> {
                return client.post<TModel>(urlPath, item).then(response => response.data);
            },

            updateAsync(item: TModel): Promise<TModel> {
                return client.put<TModel>(urlPath + '/' + item.id, item).then(response => response.data);
            },

            deleteAsync(id: TId): Promise<boolean> {
                return client
                    .delete<boolean>(urlPath + '/' + id)
                    .then(response => response.status === HttpStatusCode.NO_CONTENT);
            },
        },
        ReadApiClient<TModel, TId>(client, urlPath),
    );
