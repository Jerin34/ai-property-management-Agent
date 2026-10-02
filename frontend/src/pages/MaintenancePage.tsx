import { useState,useEffect} from 'react'
import { getMaintenanceRequests } from '../api/maintenance.api'
import type { Maintenance } from '../types/maintenance.types'
import { useNavigate } from 'react-router-dom'
import MaintenanceCard from '../components/MaintenanceCards'
import { useAuth } from '../context/Authcontext'
function MaintenancePage(){
  const { user } = useAuth();
const navigate = useNavigate();
    const [maintenance,setMaintenance] = useState<Maintenance[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [error , setError] = useState<string| null>(null);    
    useEffect(()=>{
      
        const fetchMaintenance = async () =>{
            try{
                setIsLoading(true);
                setError(null);
                const data = await getMaintenanceRequests();
                setMaintenance(data);
            }catch(error){
                console.log("Error loading maintenance requests",error);
                setError("Error loading maintenance requests");
            }finally{
                setIsLoading(false);
            }
        }
       fetchMaintenance();
    },[])
    if(isLoading){
        return <p>Loading ....</p>
    }
    if(error){
        return <p>{error}</p>
    }
    return(
        <div>
            <h1>Maintenance</h1>
             <p>
        Total Requests: {maintenance.length}
      </p>

      {maintenance.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <div>
          {maintenance.map((item) => (
            <MaintenanceCard
              key={item._id}
              maintenance={item}
            />
          ))}
        </div>
      )}
      {user?.role === "TENANT" && (
  <button onClick={() => navigate("/maintenance/create")}>
    Create Maintenance Request
  </button>
)}
        </div>
    )
}
export default MaintenancePage;