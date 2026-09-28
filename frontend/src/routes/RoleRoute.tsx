import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext.tsx";
import type { UserRole } from "../types/auth.types";
interface allowedRouteProps {
    allowedRoles:UserRole[]
}

 function RoleRoute({allowedRoles}:allowedRouteProps) {
    const {user} = useAuth();
    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(!allowedRoles.includes(user.role)){
        return <Navigate to="/login" replace/>  
    }
    return <Outlet/>

}
export default RoleRoute