import {AxiosInstance, AxiosResponse} from 'axios';
import {ReadApiClient} from "../base/read-api-client.ts";
import {CrudApiClient} from "../base/crud-api-client.ts";
import {BaseApiClient} from "../base/base-api-client.ts";
import {GetAllUserNotificationResponse} from "../../features/notifications/types/get-all-user-notification-response.ts";
import {BaseApiResponse} from "../../shared/types/base-api-response.ts";

export const NotificationsApiClient = ((client: AxiosInstance, urlPath: string = '') => {
    const getAllUserNotifications = async (): Promise<GetAllUserNotificationResponse> => {
        const response: AxiosResponse<GetAllUserNotificationResponse> =
            await client.get(`${urlPath}user`);
        return response.data;
    };

    const markNotificationAsSeen = async (notificationId: string): Promise<BaseApiResponse> => {
        const response: AxiosResponse<BaseApiResponse> =
            await client.patch(`${urlPath}${notificationId}/seen`);
        return response.data;
    };

    return {
        ...BaseApiClient(client, urlPath),
        ...ReadApiClient(client, urlPath),
        ...CrudApiClient(client, urlPath),
        getAllUserNotifications,
        markNotificationAsSeen
    };
})(BaseApiClient, 'notifications/');