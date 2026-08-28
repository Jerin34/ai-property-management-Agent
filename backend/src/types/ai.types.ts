export interface MaintenanceAiResult {
    category:
|"PLUMBING"|"ELECTRICAL"|"HVAC"|"APPLIANCE"|"STRUCTURAL"|"OTHER";
priority: | "LOW"|"MEDIUM"|"HIGH"|"EMERGENCY";
summary:string;


}
