import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {GetUploadedFilesResponse} from "../../features/file-storage/types/get-uploaded-files-response.ts";
import {GetFileTypeResponse} from "../../features/file-storage/types/get-file-type-response.ts";
import {GetFileCategoriesResponse} from "../../features/file-storage/types/get-file-categories-response.ts";
import {CreateDirectory} from "../../features/file-storage/types/create-directory.ts";
import {BaseApiResponse} from "../../shared/types/base-api-response.ts";
import {UploadFile} from "../../features/file-storage/types/upload-file.ts";
import {UpdateFileIndex} from "../../features/file-storage/types/update-file-index.ts";

export const FileStorageApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const getUploadedFiles = async (): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> =
            await client.get(`${urlPath}uploaded`);
        return response.data;
    };

    const getUploadedDirectoryFiles = async (directoryId: string): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> =
            await client.get(`${urlPath}uploaded/directory?directoryId=${directoryId}`);
        return response.data;
    };

    const getFileTypes = async (): Promise<GetFileTypeResponse> => {
        const response: AxiosResponse<GetFileTypeResponse> =
            await client.get(`${urlPath}file-types`);
        return response.data;
    };

    const getFileCategories = async (): Promise<GetFileCategoriesResponse> => {
        const response: AxiosResponse<GetFileCategoriesResponse> =
            await client.get(`${urlPath}file-categories`);
        return response.data;
    };

    const downloadFile = async (fileId: string): Promise<Blob> => {
        const response: AxiosResponse<Blob> = await client.get(`${urlPath}download/${fileId}`, {
            responseType: 'blob',
        });
        return response.data;
    };

    const createDirectory = async (createDirectory: CreateDirectory): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}create-directory`, createDirectory);
        return response.data;
    };

    const updateFileIndex = async (updateFileIndex: UpdateFileIndex): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}files/update-index`, updateFileIndex);
        return response.data;
    };

    const uploadFile = async (uploadFile: UploadFile): Promise<any> => {
        const formData = new FormData();
        formData.append("file", uploadFile.file);
        if (uploadFile.directoryId) {
            formData.append("directoryId", uploadFile.directoryId);
        }

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
        uploadFile,
        getFileTypes,
        getFileCategories,
        createDirectory,
        getUploadedDirectoryFiles,
        updateFileIndex
    };
})(BaseApiClient, 'file-storage/');
