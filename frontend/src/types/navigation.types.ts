import type { UserRole } from "./auth.types";

export interface NavigationItem{
    label:string;
    path:string;
    allowedRoles?:UserRole[];
}