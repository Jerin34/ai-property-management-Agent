import apiClient from "./client";
import  type { AuthUser, LoginResponse} from "../types/auth.types";
interface LoginInput{
    email:string;
    password:string;
}

export const login = async (credentials:LoginInput):Promise<LoginResponse> =>{
    const response = await apiClient.post("/auth/login",credentials);
    return response.data;
}
export const getCurrentUser = async():Promise<AuthUser> => {
    const response = await apiClient.get<{success:boolean,message:string,data:AuthUser;}>("/auth/me");
    return response.data.data;
};