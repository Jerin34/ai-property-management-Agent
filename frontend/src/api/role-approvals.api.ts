import apiClient from "./client";
export interface RoleApprovalRequest{
    _id:string;
    name:string;
    email:string;
    subscriptionStatus:"ACTIVE";
    roleApprovalStatus:"PENDING";
    roleApprovalRequesteAt:string;
    createdAt?:string;
}
export interface PendingApprovalsResponse{
    success:boolean;
    message:string;
    data:RoleApprovalRequest[]
}
export interface RoleApprovalActionResponse{
    success:boolean;
    message:string;
    data:RoleApprovalRequest
}
export const getPendingApprovals = async():Promise<RoleApprovalRequest[]> =>{
    const response = await apiClient.get<PendingApprovalsResponse>('/users/role-approvals/pending');
    return response.data.data
}

export const approveManagerRoleRequest = async(userId:string):Promise<void> =>{
 await apiClient.patch<RoleApprovalActionResponse>(`/users/${userId}/role-approval/approve`);
    
}
export const rejectManagerRoleRequest = async(userId:string):Promise<void> =>{
    await apiClient.patch<RoleApprovalActionResponse>(`/users/${userId}/role-approval/reject`);
}
