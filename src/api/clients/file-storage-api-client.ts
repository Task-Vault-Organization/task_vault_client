import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {GetUploadedFilesResponse} from "../../features/file-storage/types/get-uploaded-files-response.ts";

export const FileStorageApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const getUploadedFiles = async (): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> =
            await client.get(`${urlPath}uploaded`);
        return response.data;
    };

    const downloadFile = async (fileId: string): Promise<Blob> => {
        const response: AxiosResponse<Blob> = await client.get(`${urlPath}download/${fileId}`, {
            responseType: 'blob',
        });
        return response.data;
    };

    const uploadFile = async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append("file", file);

        const response: AxiosResponse<any> = await client.post(`${urlPath}upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        getUploadedFiles,
        downloadFile,
        uploadFile
    };
})(BaseApiClient, 'file-storage/');
