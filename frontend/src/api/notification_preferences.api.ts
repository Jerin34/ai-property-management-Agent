import apiClient from "./client";
import type {
    NotificationPreferences,
    UpdateNotificationPreferences
} from "../types/notificatio-preferences.types";

interface NotificationPreferencesResponse {
    success: boolean;
    data: NotificationPreferences;
}

export const getNotificationPreferences =
    async (): Promise<NotificationPreferences> => {
        const response =
            await apiClient.get<NotificationPreferencesResponse>(
                "/notifications/preferences/"
            );

        return response.data.data;
    };

export const updateNotificationPreferences = async (
    data: UpdateNotificationPreferences
): Promise<NotificationPreferences> => {
    const response =
        await apiClient.patch<NotificationPreferencesResponse>(
            "/notifications/preferences/",
            data
        );

    return response.data.data;
};