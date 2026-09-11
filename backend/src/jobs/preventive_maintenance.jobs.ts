import cron from 'node-cron';
import { processDueMaintenanceSchedule } from '../services/preventive_maintenace.services.js';
export const startPreventiveMaintenanceJob = async() =>{
    cron.schedule('0 0 * * *', async () => {
        try{
            console.log('Running preventive maintenance job')
            const maintenaces = await processDueMaintenanceSchedule()
            console.log(`Preventive Maintenaces processed ${maintenaces.length}`);

        }
        catch(err){
            console.log('Preventive Maintenace JOB Error',err);
        }
        console.log('Preventive Maintenace JOB Running')
    })
}