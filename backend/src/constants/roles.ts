export const ROLES ={
    Admin:'ADMIN',
    Manager:'MANAGER',
    Tenant:'TENANT',
    Technician:'TECHNICIAN'
}as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];