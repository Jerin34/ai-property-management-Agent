export const MAINTENANCE_STATUS = {
    Open: "OPEN",
    InProgress: "IN_PROGRESS",
    COMPLETED:"COMPLETED"
} as const;

export const MAINTENANCE_PRIORITY = {
    Low: "LOW",
    Medium: "MEDIUM",
    High: "HIGH",
    Emergency: "EMERGENCY"
} as const;

export const MAINTENANCE_CATEGORY = {
    Plumbing: "PLUMBING",
    Electrical: "ELECTRICAL",
    HVAC: "HVAC",
    Appliance: "APPLIANCE",
    Structural: "STRUCTURAL",
    Other: "OTHER"
} as const;

export type MaintenanceStatus =
    (typeof MAINTENANCE_STATUS)[keyof typeof MAINTENANCE_STATUS];

export type MaintenancePriority =
    (typeof MAINTENANCE_PRIORITY)[keyof typeof MAINTENANCE_PRIORITY];

export type MaintenanceCategory =
    (typeof MAINTENANCE_CATEGORY)[keyof typeof MAINTENANCE_CATEGORY];