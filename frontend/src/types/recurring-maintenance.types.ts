export interface RecurringMaintenance {
  isRecurring: boolean;
  requestCount: number;
  propertyId: string;
  category: string;
  periodDays: number;
  message: string;
}