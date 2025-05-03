import { AxiosInstance, AxiosResponse } from 'axios';
import { BaseApiClient } from "../base/base-api-client.ts";
import { ReadApiClient } from "../base/read-api-client.ts";
import { CrudApiClient } from "../base/crud-api-client.ts";
import {BaseApiResponse} from "../../shared/types/base-api-response.ts";
import {CreateTask} from "../../features/tasks/types/create-task.ts";
import {GetTasksResponse} from "../../features/tasks/types/get-tasks-response.ts";
import {GetTaskResponse} from "../../features/tasks/types/get-task-response.ts";
import {CreateTaskSubmission} from "../../features/tasks/types/create-task-submission.ts";

export const TasksApiClient = ((client: AxiosInstance, urlPath: string = '') => {

    const createTask = async (createTask: CreateTask): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}`, createTask);
        return response.data;
    };

    const getOwnedTasks = async (): Promise<GetTasksResponse> => {
        const response: AxiosResponse<GetTasksResponse> = await client.get(`${urlPath}owned`);
        return response.data;
    };

    const getAssignedTasks = async (): Promise<GetTasksResponse> => {
        const response: AxiosResponse<GetTasksResponse> = await client.get(`${urlPath}assigned`);
        return response.data;
    };

    const getTask = async (taskId: string): Promise<GetTaskResponse> => {
        const response: AxiosResponse<GetTaskResponse> = await client.get(`${urlPath}${taskId}`);
        return response.data;
    };

    const createTaskSubmission = async (createTaskSubmissionDto: CreateTaskSubmission): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}submit`, createTaskSubmissionDto);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        createTask,
        getOwnedTasks,
        getAssignedTasks,
        getTask,
        createTaskSubmission
    };
})(BaseApiClient, 'tasks/');