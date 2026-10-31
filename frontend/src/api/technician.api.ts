import apiClient from "./client";

export type TechnicianApplicationStatus =
  | "NOT_REQUESTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type TechnicianSkill =
  | "PLUMBING"
  | "ELECTRICAL"
  | "HVAC"
  | "APPLIANCE"
  | "STRUCTURAL"
  | "OTHER";

export type TechnicianAvailability = "FULL_TIME" | "PART_TIME" | "FLEXIBLE";

export interface TechnicianApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  technicianApplicationStatus: "PENDING";
  technicianApplicationRequestedAt?: string;
}

export interface TechnicianProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  skills: TechnicianSkill[];
  experienceYears?: number;
  serviceAreas: string[];
  availability?: TechnicianAvailability;
  workingHours?: { start: string; end: string };
  bio?: string;
  profileCompleted: boolean;
}

export interface TechnicianProfileInput {
  skills: TechnicianSkill[];
  experienceYears: number;
  serviceAreas: string[];
  availability: TechnicianAvailability;
  workingHours: { start: string; end: string };
  bio?: string;
}

export const getTechnicianApplicationStatus = async () => {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      role: string;
      status: TechnicianApplicationStatus;
      requestedAt?: string;
      approvedAt?: string;
    };
  }>("/users/technician-role-application/status");
  return response.data.data;
};

export const applyForTechnicianRole = async () => {
  const response = await apiClient.post("/users/technician-role-application");
  return response.data;
};

export const getPendingTechnicianApplications = async (): Promise<TechnicianApplication[]> => {
  const response = await apiClient.get<{ success: boolean; data: TechnicianApplication[] }>(
    "/users/technician-role-approvals/pending"
  );
  return response.data.data;
};

export const approveTechnicianApplication = async (userId: string) => {
  await apiClient.patch(`/users/${userId}/technician-role-approval/approve`);
};

export const rejectTechnicianApplication = async (userId: string) => {
  await apiClient.patch(`/users/${userId}/technician-role-approval/reject`);
};

export const getTechnicianProfile = async (): Promise<TechnicianProfile> => {
  const response = await apiClient.get<{ success: boolean; data: TechnicianProfile }>(
    "/users/technician/profile"
  );
  return response.data.data;
};

export const updateTechnicianProfile = async (data: TechnicianProfileInput) => {
  const response = await apiClient.patch<{ success: boolean; data: TechnicianProfile }>(
    "/users/technician/profile",
    data
  );
  return response.data.data;
};
