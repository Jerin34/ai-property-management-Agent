import NotificationPreferenceModel from "../models/notification_preferences.model.js";
import { updateNotificationPreferencesInput } from "../validator/notification_preferences.validator.js";
export const getNotificationPreferences = async(userId:string) =>{
    let preferences  =await NotificationPreferenceModel.findOne({user:userId})
    if(!preferences){
        preferences = await NotificationPreferenceModel.create({user:userId})
    }
    return preferences;
};
export const updateNotificationPreferences  = async(userId:string,data:updateNotificationPreferencesInput) =>{
    const preferences = await NotificationPreferenceModel.findOneAndUpdate({user:userId},{ $set :data},{new:true,upsert:true,runValidators:true});
    return preferences
}