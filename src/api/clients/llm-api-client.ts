import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {CheckFileMatchesCategoryResponse} from "../../features/llm/types/check-file-matches-category-response.ts";
import {CheckFileMatchesCategory} from "../../features/llm/types/check-file-matches-category.ts";

export const LlmApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const checkFileCategory = async (checkFileCategory: CheckFileMatchesCategory): Promise<CheckFileMatchesCategoryResponse> => {
        const response: AxiosResponse<CheckFileMatchesCategoryResponse> =
            await client.post(`${urlPath}check-file-category`, checkFileCategory);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        checkFileCategory,
    };
})(BaseApiClient, 'llm/');