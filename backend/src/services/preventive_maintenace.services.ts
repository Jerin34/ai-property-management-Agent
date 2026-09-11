import MaintenanceSchedule from "../models/maintenance_schedule.model.js";
import Property from "../models/property.models.js";
import Maintaince from "../models/maintenance.model.js";
import { MAINTENANCE_STATUS,MAINTENANCE_PRIORITY ,MAINTENANCE_CATEGORY} from "../constants/maintenance.js";
export const processDueMaintenanceSchedule = async () => {
    const now = new Date();
    console.log(now)
    const schedules = await MaintenanceSchedule.find({
        isActive:true,
        nextDueDate:{
            $lte:now
        }
    })
    console.log(schedules);
    console.log(schedules.length)
    
    const createMaintenances = [];
    for(const schedule of schedules){
        const property = await Property.findById(schedule.property)
        if(!property){
            continue;
        }
        const maintenance = await Maintaince.create({
            property:property._id,
              tenant: property.manager,

            title: schedule.title,

            description:
                schedule.description ||
                `Scheduled preventive maintenance for ${schedule.title}`,

            aiSummary:
                `Preventive maintenance scheduled for ${schedule.title}`,

            category: schedule.category,

            priority: MAINTENANCE_PRIORITY.Medium,

            status: MAINTENANCE_STATUS.Open
            
        });
        createMaintenances.push(maintenance);
        const nextDueDate = new Date(schedule.nextDueDate);
        switch(schedule.frequency){
              case "DAILY":
                nextDueDate.setDate(
                    nextDueDate.getDate() + 1
                );
                break;

            case "WEEKLY":
                nextDueDate.setDate(
                    nextDueDate.getDate() + 7
                );
                break;

            case "MONTHLY":
                nextDueDate.setMonth(
                    nextDueDate.getMonth() + 1
                );
                break;

            case "QUARTERLY":
                nextDueDate.setMonth(
                    nextDueDate.getMonth() + 3
                );
                break;

            case "YEARLY":
                nextDueDate.setFullYear(
                    nextDueDate.getFullYear() + 1
                );
                break;
        }
        schedule.nextDueDate = nextDueDate;
        await schedule.save();
    }
    return createMaintenances;
}