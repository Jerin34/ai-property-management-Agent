import Maintaince from "../models/maintenance.model.js";
import type { UpdateMaintenanceCostInput } from "../validator/maintenance_cost.validator.js";   
export const updateMaintenanceCost = async(maintenanceId:string,data:UpdateMaintenanceCostInput) =>{
    console.log('data reahced')
    const maintenance = await Maintaince.findByIdAndUpdate(maintenanceId,data,
{
    new:true,
    runValidators:true
}
);
if(!maintenance){
    throw new Error("Maintenance request not found")
}
return maintenance;
};