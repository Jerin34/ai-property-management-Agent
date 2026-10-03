import type { TechnicianRecommendation } from "../types/technician.types";
interface TechnicianRecommendationsProps {
  recommendations: TechnicianRecommendation[];
  isLoading: boolean;
  isAssigning: boolean;
  onSelect: (technicianId: string) => void;
}
function TechnicianRecommendations({ recommendations, isLoading,isAssigning ,onSelect }: TechnicianRecommendationsProps) {
    if(isLoading){
        return <p>Loading.....</p>
    }
    if(recommendations.length === 0){
        return <p>No Technician Recommendations</p>
    }
    return(
        <section>
            <h2>Technician Recommendations</h2>
            {recommendations.map((technician) =>(
                <div key={technician.technicianId}>
                    <h4>{technician.technicianName}</h4>
                    <p><strong>Score: </strong>{technician.score}</p>
                    <h3>Why this Technician ?</h3>
                    <ul>
                       {technician.reasons.map((reason,index) =>(
                        <li key={index}>{reason}</li>
                       ))}
                    </ul>
                    <button onClick={() => onSelect(technician.technicianId)} disabled={isAssigning} >{ isAssigning ? "Assigning..." : "Assign"}</button>
                </div>
            ))}
        </section>
    );
}
export default TechnicianRecommendations;