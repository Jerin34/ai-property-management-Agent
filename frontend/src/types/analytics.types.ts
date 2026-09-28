export interface MaintenanceAnalytics {
  overview: {
    totalRequests: number;
    openRequests: number;
    inProgressRequests: number;
    completedRequests: number;
  };

  byPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    EMERGENCY: number;
  };

  byCategory: {
    PLUMBING: number;
    ELECTRICAL: number;
    HVAC: number;
    APPLIANCE: number;
    STRUCTURAL: number;
    OTHER: number;
  };

  technicianWorkload: {
    technicianId: string;
    technicianName: string;
    totalRequests: number;
    inProgressRequests: number;
    completedRequests: number;
  }[];

  resolutionMetrics: {
    averageResolutionTimeHours: number;
  };

  propertyIssues: {
    propertyId: string;
    propertyName: string;
    requestCount: number;
  }[];
}