
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/maintenance.model.js", () => ({
    default: {
        find: vi.fn()
    }
}));

vi.mock("../models/property.models.js", () => ({
    default: {
        find: vi.fn()
    }
}));

vi.mock("./property-health.services.js", () => ({
    PropertyHealthService: vi.fn()
}));

import Maintaince from "../models/maintenance.model.js";
import Property from "../models/property.models.js";
import { PropertyHealthService } from "./property-health.services.js";
import { MaintenanceAlertService } from "./maintenace-Alert_services.js";

describe("MaintenanceAlertService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("limits manager alerts to properties managed by that manager", async () => {
        const managerPropertyIds = ["property-A"];

        vi.mocked(Property.find).mockReturnValue({
            distinct: vi.fn().mockResolvedValue(managerPropertyIds)
        } as never);

        vi.mocked(Maintaince.find).mockResolvedValue([
            {
                _id: "maintenance-A",
                property: "property-A",
                priority: "EMERGENCY",
                category: "PLUMBING",
                status: "OPEN"
            }
        ] as never);

        vi.mocked(PropertyHealthService).mockResolvedValue({
            healthScore: 80,
            riskLevel: "LOW",
            openRequests: 1
        } as never);

        const alerts = await MaintenanceAlertService({
            mode: "manager",
            managerId: "manager-A"
        });

        expect(Property.find).toHaveBeenCalledWith({
            manager: "manager-A"
        });

        expect(Maintaince.find).toHaveBeenCalledWith({
            property: { $in: managerPropertyIds }
        });

        expect(alerts.every(alert => alert.propertyId === "property-A")).toBe(true);
        expect(alerts.some(alert => alert.type === "EMERGENCY_MAINTENANCE")).toBe(true);
    });

    it("returns no alerts when the manager has no properties", async () => {
        vi.mocked(Property.find).mockReturnValue({
            distinct: vi.fn().mockResolvedValue([])
        } as never);

        const alerts = await MaintenanceAlertService({
            mode: "manager",
            managerId: "manager-with-no-properties"
        });

        expect(alerts).toEqual([]);
        expect(Maintaince.find).not.toHaveBeenCalled();
        expect(PropertyHealthService).not.toHaveBeenCalled();
    });

    it("uses an unfiltered maintenance query for admin mode", async () => {
        vi.mocked(Maintaince.find).mockResolvedValue([] as never);

        const alerts = await MaintenanceAlertService({
            mode: "admin"
        });

        expect(Maintaince.find).toHaveBeenCalledWith({});
        expect(alerts).toEqual([]);
    });

    it("uses an unfiltered maintenance query for system mode", async () => {
        vi.mocked(Maintaince.find).mockResolvedValue([] as never);

        const alerts = await MaintenanceAlertService({
            mode: "system"
        });

        expect(Maintaince.find).toHaveBeenCalledWith({});
        expect(alerts).toEqual([]);
    });
});
