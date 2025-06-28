import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {CheckFileMatchesCategoryResponse} from "../../features/llm/types/check-file-matches-category-response.ts";
import {CheckFileMatchesCategory} from "../../features/llm/types/check-file-matches-category.ts";
import {CategorizeFolderRequest} from "../../features/llm/types/categorize-folder-request.ts";
import {CategorizeFolderResponse} from "../../features/llm/types/categorize-folder-response.ts";

export const LlmApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const checkFileCategory = async (checkFileCategory: CheckFileMatchesCategory): Promise<CheckFileMatchesCategoryResponse> => {
        const response: AxiosResponse<CheckFileMatchesCategoryResponse> =
            await client.post(`${urlPath}check-file-category`, checkFileCategory);
        return response.data;
    };

    const extractJsonFromImage = async (fileId: string): Promise<any> => {
        const response: AxiosResponse<any> = await client.get(`${urlPath}image-to-json/${fileId}`);
        return response.data;
    };

    const categorizeFolder = async (dto: CategorizeFolderRequest): Promise<CategorizeFolderResponse> => {
        const response: AxiosResponse<CategorizeFolderResponse> = await client.post(`${urlPath}categorize-folder`, dto);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        checkFileCategory,
        extractJsonFromImage,
        categorizeFolder
    };
})(BaseApiClient, 'llm/');