import { AxiosInstance } from 'axios';
import {ModelBase} from "../../shared/types/model-base.ts";

export const ReadApiClient = <TModel extends ModelBase<TId>, TId>(client: AxiosInstance, urlPath: string) => {
    return {
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