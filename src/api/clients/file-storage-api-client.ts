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
import {RenameFile} from "../../features/file-storage/types/rename-file.ts";
import {RenameFileResponse} from "../../features/file-storage/types/rename-file-response.ts";
import {GetFileHistoryResponse} from "../../features/file-storage/types/get-file-history-response.ts";
import {CreateOrUpdateFileShareRequest} from "../../features/file-storage/types/create-or-update-file-share-request.ts";
import {ResolveFileShareRequest} from "../../features/file-storage/types/resolve-file-share-request.ts";
import {GetFileShareDataResponse} from "../../features/file-storage/types/get-file-share-data-response.ts";
import {GetFileResponse} from "../../features/file-storage/types/get-file-response.ts";
import {GetFilesByTypeResponse} from "../../features/file-storage/types/get-files-by-type-response.ts";
import {CreateCustomFileCategory} from "../../features/file-storage/types/create-custom-file-category.ts";
import {GetAllCustomFileCategoriesResponse} from "../../features/file-storage/types/get-all-custom-file-categories-response.ts";

export const FileStorageApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const getUploadedFiles = async (): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}uploaded`);
        return response.data;
    };

    const getAllDirectoryFiles = async (directoryId: string): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}directory/${directoryId}/files/all`);
        return response.data;
    };

    const getAllDirectoryUploadedFiles = async (directoryId: string): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}directory/${directoryId}/files/uploaded`);
        return response.data;
    };

    const getAllDirectorySharedFiles = async (directoryId: string): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}directory/${directoryId}/files/shared`);
        return response.data;
    };

    const getFileTypes = async (): Promise<GetFileTypeResponse> => {
        const response: AxiosResponse<GetFileTypeResponse> = await client.get(`${urlPath}file-types`);
        return response.data;
    };

    const getFileCategories = async (): Promise<GetFileCategoriesResponse> => {
        const response: AxiosResponse<GetFileCategoriesResponse> = await client.get(`${urlPath}file-categories`);
        return response.data;
    };

    const getFileHistory = async (fileId: string): Promise<GetFileHistoryResponse> => {
        const response: AxiosResponse<GetFileHistoryResponse> = await client.get(`${urlPath}${fileId}/history`);
        return response.data;
    };

    const downloadFile = async (fileId: string): Promise<Blob> => {
        const response: AxiosResponse<Blob> = await client.get(`${urlPath}download/${fileId}`, { responseType: 'blob' });
        return response.data;
    };

    const createDirectory = async (createDirectory: CreateDirectory): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}create-directory`, createDirectory);
        return response.data;
    };

    const deleteFile = async (fileId: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.delete(`${urlPath}${fileId}`);
        return response.data;
    };

    const renameFile = async (renameFile: RenameFile): Promise<RenameFileResponse> => {
        const response: AxiosResponse<RenameFileResponse> = await client.patch(`${urlPath}file/rename`, renameFile);
        return response.data;
    };

    const getFile = async (fileId: string): Promise<GetFileResponse> => {
        const response: AxiosResponse<GetFileResponse> = await client.get(`${urlPath}${fileId}`);
        return response.data;
    };

    const updateFileIndex = async (updateFileIndex: UpdateFileIndex): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}files/update-index`, updateFileIndex);
        return response.data;
    };

    const createOrUpdateFileShareRequest = async (dto: CreateOrUpdateFileShareRequest): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}file-share-requests`, dto);
        return response.data;
    };

    const resolveFileShareRequest = async (dto: ResolveFileShareRequest): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.patch(`${urlPath}file-share-requests/resolve`, dto);
        return response.data;
    };

    const getFileShareData = async (fileId: string): Promise<GetFileShareDataResponse> => {
        const response: AxiosResponse<GetFileShareDataResponse> = await client.get(`${urlPath}file-share/${fileId}`);
        return response.data;
    };

    const getFilesByType = async (fileTypeId: string): Promise<GetFilesByTypeResponse> => {
        const response: AxiosResponse<GetFilesByTypeResponse> = await client.get(`${urlPath}files/by-type/${fileTypeId}`);
        return response.data;
    };

    const uploadFile = async (uploadFile: UploadFile): Promise<any> => {
        const formData = new FormData();
        uploadFile.files.forEach((file) => {
            formData.append("files", file);
        });
        if (uploadFile.directoryId) {
            formData.append("DirectoryId", uploadFile.directoryId);
        }
        const response: AxiosResponse<any> = await client.post(`${urlPath}upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    };

    const getAllUserFiles = async (): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}files/all`);
        return response.data;
    };

    const getSharedFiles = async (): Promise<GetUploadedFilesResponse> => {
        const response: AxiosResponse<GetUploadedFilesResponse> = await client.get(`${urlPath}files/shared`);
        return response.data;
    };

    const createCustomFileCategory = async (dto: CreateCustomFileCategory): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}file-categories/custom`, dto);
        return response.data;
    };

    const deleteCustomFileCategory = async (categoryId: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.delete(`${urlPath}file-categories/custom/${categoryId}`);
        return response.data;
    };

    const getAllCustomFileCategories = async (): Promise<GetAllCustomFileCategoriesResponse> => {
        const response: AxiosResponse<GetAllCustomFileCategoriesResponse> = await client.get(`${urlPath}file-categories/custom`);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        getUploadedFiles,
        getAllDirectoryFiles,
        getAllDirectoryUploadedFiles,
        getAllDirectorySharedFiles,
        getFileTypes,
        getFileCategories,
        getFileHistory,
        downloadFile,
        createDirectory,
        deleteFile,
        renameFile,
        getFile,
        updateFileIndex,
        createOrUpdateFileShareRequest,
        resolveFileShareRequest,
        getFileShareData,
        getFilesByType,
        uploadFile,
        getAllUserFiles,
        getSharedFiles,
        createCustomFileCategory,
        deleteCustomFileCategory,
        getAllCustomFileCategories
    };
})(BaseApiClient, 'file-storage/');