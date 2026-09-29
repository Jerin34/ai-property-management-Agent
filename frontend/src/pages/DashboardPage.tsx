import { useState,useEffect } from "react";
import  getMaintenaceAnalytics from '../api/analytics.api';
import type { MaintenanceAnalytics } from "../types/analytics.types";
import KpiCard from "../components/kpicards";
import PriorityBreakdown from "../components/priorityBreakdown";
import CategroyBreakdown from "../components/categoryBreakdown";
import TechnicianWorkLoad from "../components/TechnicianWorkload";
import PropertyIssues from "../components/propertyIssues";
import ResolutionMetric from "../components/ResolutionMetric";
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
            <div className="kpi-grid">
                <KpiCard title="Total Requests" value={analytics.overview.totalRequests} />
                <KpiCard title="Open Requests" value={analytics.overview.openRequests} />
                <KpiCard title="In Progress Requests" value={analytics.overview.inProgressRequests} />
                <KpiCard title="Compeleted Requests" value={analytics.overview.completedRequests} />
                <PriorityBreakdown data={analytics.byPriority} />
                <CategroyBreakdown data={analytics.byCategory} />
                <TechnicianWorkLoad data={analytics.technicianWorkload} />
                <PropertyIssues data={analytics.propertyIssues} />
                <ResolutionMetric averageResolutionTimeHours={analytics.resolutionMetrics.averageResolutionTimeHours} />
            </div>
            
        </div>
    )
}
export default DashboardPage