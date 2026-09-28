import { useState,useEffect } from "react";
import  getMaintenaceAnalytics from '../api/analytics.api';
import type { MaintenanceAnalytics } from "../types/analytics.types";

function DashboardPage(){
    const [analytics, setAnalytics] = useState<MaintenanceAnalytics | null>(null);
    const [isLoading,setIsLoading] = useState(false);
    const [error ,setError] = useState<string| null>(null);

    useEffect(() =>{
        const fetchAnalytics = async () =>{
            try{
                setIsLoading(true);
                setError(null); 
                const data = await getMaintenaceAnalytics();
                setAnalytics(data);
            }
            catch(error){
                console.log('Failed to fetch the analytics',error);
                setError('Failed to fetch the analytics');
            }
            finally{
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    },[]);
    if(isLoading){
     return <p>Loading</p>
    }
    if(error){
        return <p>{error}</p>
    }
    if(!analytics){
        return <p>No dashboard data avialable</p>
    }
    return (
        <div>
            <h1>Dashboard </h1>
            <p> Total Requests:{""}{analytics.overview.totalRequests}</p>
            <p> Open Requests:{""}{analytics.overview.openRequests}</p>
            <p> In Progress:{""}{analytics.overview.inProgressRequests}</p>
            <p> Completed:{""}{analytics.overview.completedRequests}</p>
        </div>
    )
}
export default DashboardPage