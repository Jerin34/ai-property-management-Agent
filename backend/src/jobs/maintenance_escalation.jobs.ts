import cron from 'node-cron'
import { ProcessmaintenanceEscaltion } from '../services/maintenance_escalation.services.js'
export const startMaintenanceEscaltionJob = async() => {
    cron.schedule("0 * * * *",async() =>{
        try{
            console.log('Escalation Service Running')
            const escaltion = await ProcessmaintenanceEscaltion();
            console.log(`Escaltion Processed ${escaltion.length}`)
        }
        catch(err){
            console.error("Maintenance Escalation Job Error ",err)
        }
    })
}
