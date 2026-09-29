interface Technician{
    technicianId:string;
    technicianName:string;
    totalRequests:number;
    inProgressRequests:number;
    completedRequests:number;
}
interface TechnicianWorkLoadProps{
    data:Technician[]
}
function TechnicianWorkLoad({data}:TechnicianWorkLoadProps){
    return(
        <div>
            <h2>Technician Workload</h2>
            {data.length === 0 ? (
                <p>No technicians found</p>
            ):(
                data.map((technician) =>(
                    <div key={technician.technicianId}>
                        <p>Technician :{technician.technicianName}</p>
                        <p>Total Requests :{technician.totalRequests}</p>
                        <p>In Progress Requests :{technician.inProgressRequests}</p>
                        <p>Completed Requests {technician.completedRequests}</p>
                    </div>
                ))
            )}
        </div>
    )
}
export default TechnicianWorkLoad