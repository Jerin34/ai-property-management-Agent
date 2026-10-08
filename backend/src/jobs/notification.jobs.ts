import cron from 'node-cron';
import { generateNotificationsFromAlerts } from '../services/notification-generation.service.js';

export const startNotificationsJob = async() =>{
    cron.schedule("0 * * * *", async() =>{
        try{
            console.log("Running notification job");
        const notifications = await generateNotificationsFromAlerts();
        console.log(`Notifications Generated ${notifications.length}`);
        }
        catch(err){
            console.error(`Notification JOB Error ${err}`);
        }
        
    
    });
}