import { useNavigate } from "react-router-dom";
import type { Maintenance } from "../types/maintenance.types";

interface MaintenanceCardProps{
    maintenance:Maintenance
}
function MaintenanceCards({maintenance,}:MaintenanceCardProps) {
    const navigate = useNavigate();
    return(
         <div>
      <h2>{maintenance.title}</h2>

      <p>
        <strong>Status:</strong>{" "}
        {maintenance.status}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        {maintenance.priority}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {maintenance.category}
      </p>

      <p>
        {maintenance.description}
      </p>

      <button
        onClick={() =>
          navigate(`/maintenance/${maintenance._id}`)
        }
      >
        View Details
      </button>
    </div>
    )
}
export default MaintenanceCards;