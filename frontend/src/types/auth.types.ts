export type UserRole = "ADMIN" | "TENANT" | 'MANAGER' | 'TECHNICIAN';
export interface AuthUser {
    id: string;
    name:string;
    email:string;
    phone?:string;
    role: UserRole;
}

export interface LoginData{
    user:AuthUser;
    token:string;
}
export interface LoginResponse{
    success:boolean;
    message:string;
    data:LoginData;
}