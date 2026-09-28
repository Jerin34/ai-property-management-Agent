import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext.tsx";
function ProtectedRoute(){
    const { user,isLoading} = useAuth();
    if(isLoading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
    return <Outlet/>
}
export default ProtectedRoute