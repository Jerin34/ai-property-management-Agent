import NotificationModel from "../models/notification.model.js";
import { createNotificationInput } from "../validator/notification.validator.js";
export const createNotification = async(data:createNotificationInput) =>{
    const notification = await NotificationModel.create(data);
    return notification
}
export const getNotifications = async(userId:string)=>{
    const notifications = await NotificationModel.find({
        recipient:userId,
    }).sort({createdAt:1})
    return notifications
}

export const markasReadNotifications = async (
    userId: string,
    notificationIds: string[]
) => {

    const notifications = await NotificationModel.updateMany(
        {
            _id: { $in: notificationIds },
            recipient: userId
        },
        {
            $set: {
                isRead: true
            }
        }
    );

    return notifications;
};