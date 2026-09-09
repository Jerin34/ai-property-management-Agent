import mongoose from 'mongoose'
export interface INotificationPreferences {
    user:mongoose.Types.ObjectId,
    emergencyMaintenance:boolean,
    highPriorityUnresolved:boolean,
    lowPropertyHealth:boolean,
    maintenanceBacklog:boolean
}