import { AxiosInstance, AxiosResponse } from 'axios';
import { BaseApiClient } from "../base/base-api-client.ts";
import { ReadApiClient } from "../base/read-api-client.ts";
import { CrudApiClient } from "../base/crud-api-client.ts";
import { BaseApiResponse } from "../../shared/types/base-api-response.ts";
import { CreateTask } from "../../features/tasks/types/create-task.ts";
import { GetTaskResponse } from "../../features/tasks/types/get-task-response.ts";
import { CreateTaskSubmission } from "../../features/tasks/types/create-task-submission.ts";
import { GetOwnedTasksResponse } from "../../features/tasks/types/get-owned-tasks-response.ts";
import { GetAssignedTasksResponse } from "../../features/tasks/types/get-assigned-tasks-response.ts";
import { GetOwnedTaskResponse } from "../../features/tasks/types/get-owned-task-response.ts";
import { GetAssignedTaskResponse } from "../../features/tasks/types/get-assigned-task-response.ts";
import {GetTaskSubmissionResponse} from "../../features/tasks/types/get-task-submission-response.ts";
import {ResolveTaskSubmission} from "../../features/tasks/types/resolve-task-submission.ts";

export const TasksApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const createTask = async (createTask: CreateTask): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.post(`${urlPath}`, createTask);
        return response.data;
    };

    const getOwnedTasks = async (sortBy: string = "", filterBy: string = ""): Promise<GetOwnedTasksResponse> => {
        const response: AxiosResponse<GetOwnedTasksResponse> = await client.get(`${urlPath}owned`, {
            params: { sortBy, filterBy }
        });
        return response.data;
    };

    const getAssignedTasks = async (sortBy: string = "", filterBy: string = ""): Promise<GetAssignedTasksResponse> => {
        const response: AxiosResponse<GetAssignedTasksResponse> = await client.get(`${urlPath}assigned`, {
            params: { sortBy, filterBy }
        });
        return response.data;
    };

    const getTask = async (taskId: string): Promise<GetTaskResponse> => {
        const response: AxiosResponse<GetTaskResponse> = await client.get(`${urlPath}${taskId}`);
        return response.data;
    };

    const getOwnedTask = async (taskId: string): Promise<GetOwnedTaskResponse> => {
        const response: AxiosResponse<GetOwnedTaskResponse> = await client.get(`${urlPath}${taskId}/owned`);
        return response.data;
    };

    const getAssignedTask = async (taskId: string): Promise<GetAssignedTaskResponse> => {
        const response: AxiosResponse<GetAssignedTaskResponse> = await client.get(`${urlPath}${taskId}/assigned`);
        return response.data;
    };

    const getTaskSubmissions = async (taskId: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> = await client.get(`${urlPath}${taskId}/submissions`);
        return response.data;
    };

    const getTaskSubmissionsForAssignee = async (taskId: string, assigneeId: string): Promise<GetTaskSubmissionResponse> => {
        const response: AxiosResponse<GetTaskSubmissionResponse> = await client.get(`${urlPath}${taskId}/submissions/${assigneeId}`);
        return response.data;
    };

    const createTaskSubmission = async (createTaskSubmissionDto: CreateTaskSubmission): Promise<BaseApiResponse> => {
        const response: AxiosResponse<CreateTaskSubmission> = await client.post(`${urlPath}submit`, createTaskSubmissionDto);
        return response.data;
    };

    const resolveTaskSubmission = async (resolveTaskSubmission: ResolveTaskSubmission): Promise<BaseApiResponse> => {
        const response: AxiosResponse<CreateTaskSubmission> = await client.post(`${urlPath}resolve-submission`, resolveTaskSubmission);
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
        getOwnedTask,
        getAssignedTask,
        getTaskSubmissions,
        getTaskSubmissionsForAssignee,
        createTaskSubmission,
        resolveTaskSubmission
    };
})(BaseApiClient, 'tasks/');