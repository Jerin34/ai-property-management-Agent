export type MaintenanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED";

export type MaintenancePriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "EMERGENCY";

export type MaintenanceCategory =
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "APPLIANCE"
  | "STRUCTURAL"
  | "OTHER";

export type MaintenanceEscalationLevel =
  | "NONE"
  | "HIGH"
  | "CRITICAL";

export interface Maintenance {
  _id: string;

  property:
    | string
    | {
        _id: string;
        name?: string;
      };

  tenant:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };

  title: string;
  description: string;
  aiSummary: string;

  category: MaintenanceCategory;
  priority: MaintenancePriority;

  esclationLevel?: MaintenanceEscalationLevel;

  status: MaintenanceStatus;

  technician:
    | string
    | null
    | {
        _id: string;
        name?: string;
        email?: string;
      };

  escaltedAt?: string;

  estimatedCost?: number;
  actualCost?: number;
  laborCost?: number;
  materialCost?: number;

  createdAt: string;
  updatedAt: string;
}
export interface CreateMaintenanceInput {
  propertyId: string;
  title: string;
  description: string;
}

export interface AssignTechnicianInput {
  technicianId: string;
}

export interface UpdateMaintenanceStatusInput {
  status: "IN_PROGRESS" | "COMPLETED";
}