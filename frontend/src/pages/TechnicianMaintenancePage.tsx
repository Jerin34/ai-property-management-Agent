 import { useEffect,useState } from "react";
 import { getTechnicianMaintenanceRequests } from "../api/maintenance.api";
 import type { Maintenance } from "../types/maintenance.types";

 function TechnicianMaintenancePage(){
    const [maintenanceRequest,setGetMaintenanceRequests] = useState<Maintenance[]>([])
    const [ isloading,setIsLoading] = useState(true);
    const [error , setError] =useState<string | null>(null);
    useEffect(()=>{
        const fetchMaintenance = async () =>{
            try{
                setIsLoading(true);
                setError(null);
                const data = await getTechnicianMaintenanceRequests();
                setGetMaintenanceRequests(data);
            }catch(err){
                console.log("Error loading maintenance requests",err);
                setError("Error loading maintenance requests");
            }finally{
                setIsLoading(false);
            }
        }
        fetchMaintenance();
    },[])
if(isloading){
    return <p>Loading.........</p>
}
if(error){
    return <p>{error}</p>
}
    return(
    <div>
        <h1>My Maintenance Requests</h1>
        {
            maintenanceRequest.length === 0 ?(
                <p>No Maintenance Requests Assigned To You</p>
            ):(
                maintenanceRequest.map((maintenance) => (
                    <div key={maintenance._id}>
                        <h2>{maintenance.title}</h2>
                        <p>Status: {maintenance.status}</p>
                        <p>Priority: {maintenance.priority}</p>
                        <p>Category: {maintenance.category}</p>
                    </div>
             ) ))
        }
    </div>

    )
 }
 export default TechnicianMaintenancePage;