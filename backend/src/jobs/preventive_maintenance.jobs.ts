
import cron from "node-cron";
import {
    processDueMaintenanceScheduleSystem
} from "../services/preventive_maintenace.services.js";

export const startPreventiveMaintenanceJob = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Running preventive maintenance job");
            console.log("Preventive maintenance cron job scheduled");
            const maintenances =
                await processDueMaintenanceScheduleSystem();

            console.log(
                `Preventive maintenances processed: ${maintenances.length}`
            );
        } catch (error) {
            console.error("Preventive maintenance job error:", error);
        }
    });

    console.log("Preventive maintenance cron job scheduled");
};
