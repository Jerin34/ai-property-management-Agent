import Maintaince from "../models/maintainance.model.js";
import type { UpdateMaintenanceCostInput } from "../validator/maintenance_cost.validator.js";

export const updateMaintenanceCost = async (
    maintenanceId: string,
    userId: string,
    data: UpdateMaintenanceCostInput
) => {
    const maintenance = await Maintaince.findById(maintenanceId);

    if (!maintenance) {
        throw new Error("Maintenance request not found");
    }

    if (
        !maintenance.technician ||
        maintenance.technician.toString() !== userId
    ) {
        throw new Error("You are not allowed to update this request");
    }

    if (data.laborCost !== undefined) {
        maintenance.laborCost = data.laborCost;
    }

    if (data.materialCost !== undefined) {
        maintenance.materialCost = data.materialCost;
    }

    maintenance.actualCost =
        (maintenance.laborCost ?? 0) +
        (maintenance.materialCost ?? 0);

    await maintenance.save();

    return maintenance;
};