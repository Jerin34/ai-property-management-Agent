import type { Notification } from "../types/notification.types";
interface NotificationResponse{
    success:boolean;
    data:Notification[]
}
import apiClient from "./client";
export const getNotifications = async():Promise<Notification[]> =>{
    const response  = await apiClient.get<NotificationResponse>('/notifications');
    return response.data.data
}
export const markNotificationsAsRead = async(notificationIds:string[])  =>{
const response = await apiClient.patch("/notifications/read",{notificationIds});
return response.data
}
