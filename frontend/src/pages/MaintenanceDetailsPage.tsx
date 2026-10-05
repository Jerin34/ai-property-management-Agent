import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getMaintenanceById,
  getTechnicianRecommendation,
  assignTechnician,
  getRecurringMaintenance,
  updateMaintenanceStatus,
  getMaintenanceUpdates
} from "../api/maintenance.api";
import type { Maintenance,MaintenanceUpdates } from "../types/maintenance.types";
import type { TechnicianRecommendation } from "../types/technician.types";
import TechnicianRecommendations from "../components/TechnicianRecommendation";
import MaintenancesUpdates from "../components/MaintenanceUpdates";
import AddMaintenanceUpdate from "../components/AddMaintenanceUpdates";
import { useAuth } from "../context/Authcontext";
import type { RecurringMaintenance as RecurringMaintenanceData } from "../types/recurring-maintenance.types";
import RecurringMaintenance from "../components/RecurringMaintenaceCard";

function MaintenanceDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<
    TechnicianRecommendation[]
  >([]);
  const [updates,setUpdates] = useState<MaintenanceUpdates[]>([]);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [recurringData, setRecurringData] =
    useState<RecurringMaintenanceData | null>(null);
  const [isRecurringLoading, setIsRecurringLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  useEffect(() => {
    const fetchMaintenance = async () => {
      if (!id) {
        setError("Maintenance request ID is missing.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMaintenanceById(id);
        setMaintenance(data);
        const updatesData = await getMaintenanceUpdates(id);
        setUpdates(updatesData);
        if (user?.role === "MANAGER") {
          try {
            setIsRecurringLoading(true);

            const recurring = await getRecurringMaintenance(id);

            setRecurringData(recurring);
          } catch (error) {
            console.error("Failed to load recurring maintenance:", error);
          } finally {
            setIsRecurringLoading(false);
          }
        }
        if (user?.role === "MANAGER") {
          try {
            setIsRecommendationLoading(true);
            const recommendationData = await getTechnicianRecommendation(id);
            setRecommendations(recommendationData);
          } catch (err) {
            console.log("Error loading technician recommendation", err);
          } finally {
            setIsRecommendationLoading(false);
          }
        }
      } catch (err) {
        console.log("Error loading maintenance requests", err);
        setError("Failed to load maintenance requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaintenance();
  }, [id, user]);

 
  const handleStatusUpdate = async (
  status: "IN_PROGRESS" | "COMPLETED"
) => {
  if (!maintenance) {
    return;
  }

  try {
    setIsUpdatingStatus(true);

    const updatedMaintenance = await updateMaintenanceStatus(
      maintenance._id,
      { status }
    );

    setMaintenance(updatedMaintenance);
  } catch (err) {
    console.log("Failed to update maintenance status", err);
  } finally {
    setIsUpdatingStatus(false);
  }
};

  if (isLoading) {
    return <p>Loading.........</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (!maintenance) {
    return <p>Maintenance request not found</p>;
  }
    const isAssignedTechnician =
    user?.role === "TECHNICIAN" &&
    maintenance.technician &&
    typeof maintenance.technician !== "string" &&
    maintenance.technician._id === user.id;
  return (
    <div>
      <h1>Maintenance Request</h1>
      <h2>{maintenance.title}</h2>
      <h3>Description</h3>
      <p>{maintenance.description}</p>
      <h3>AI Summary</h3>
      <p>
        {maintenance.aiSummary === null
          ? "No summary available"
          : maintenance?.aiSummary}
      </p>
      <h3>Request Information</h3>
     {user?.role === "TECHNICIAN" && (
  <div>
    {maintenance.status === "OPEN" && (
      <button
        onClick={() => handleStatusUpdate("IN_PROGRESS")}
        disabled={isUpdatingStatus}
      >
        {isUpdatingStatus ? "Updating..." : "Start Work"}
      </button>
    )}

    {maintenance.status === "IN_PROGRESS" && (
      <button
        onClick={() => handleStatusUpdate("COMPLETED")}
        disabled={isUpdatingStatus}
      >
        {isUpdatingStatus ? "Updating..." : "Complete Work"}
      </button>
    )}
  </div>
)}
      <p>
        <strong>Priority:</strong> {maintenance.priority}
      </p>
      <p>
        <strong>Status:</strong> {maintenance.status}
      </p>
      <p>
        <strong>Escalation Level:</strong>{" "}
        {maintenance.esclationLevel ?? "NONE"}
      </p>
      <h3>Property</h3>
      {typeof maintenance.property === "string" ? (
        <p>{maintenance.property}</p>
      ) : (
        <p>{maintenance.property.name ?? maintenance.property._id}</p>
      )}
      <h3>Tenant</h3>
      {typeof maintenance.tenant === "string" ? (
        <p>{maintenance.tenant}</p>
      ) : (
        <div>
          <p>{maintenance.tenant.name ?? maintenance.tenant._id}</p>

          {maintenance.tenant.email && <p>{maintenance.tenant.email}</p>}
        </div>
      )}
      <h3>Technician</h3>
      {!maintenance.technician ? (
        <p>No technician assigned.</p>
      ) : typeof maintenance.technician === "string" ? (
        <p>{maintenance.technician}</p>
      ) : (
        <div>
          <p>{maintenance.technician.name ?? maintenance.technician._id}</p>

          {maintenance.technician.email && (
            <p>{maintenance.technician.email}</p>
          )}
        </div>
      )}
      <h3>Costs</h3>
      <p>
        <strong>Estimated Cost:</strong>{" "}
        {maintenance.estimatedCost ?? "Not available"}
      </p>

      <p>
        <strong>Actual Cost:</strong>{" "}
        {maintenance.actualCost ?? "Not available"}
      </p>

      <p>
        <strong>Labor Cost:</strong> {maintenance.laborCost ?? "Not available"}
      </p>

      <p>
        <strong>Material Cost:</strong>{" "}
        {maintenance.materialCost ?? "Not available"}
      </p>
      <h3>Dates</h3>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(maintenance.createdAt).toLocaleString()}
      </p>

      <p>
        <strong>Updated:</strong>{" "}
        {new Date(maintenance.updatedAt).toLocaleString()}
      </p>

      {maintenance.escaltedAt && (
        <p>
          <strong>Escalated:</strong>{" "}
          {new Date(maintenance.escaltedAt).toLocaleString()}
        </p>
      )}
      {user?.role === "MANAGER" && (
        <TechnicianRecommendations
          recommendations={recommendations}
          isLoading={isRecommendationLoading}
          isAssigning={isAssigning}
          onSelect={async (technicianId) => {
            if (!id) {
              return;
            }
            try {
              setIsAssigning(true);
              const updatedMaintence = await assignTechnician(id, {
                technicianId,
              });
              setMaintenance(updatedMaintence);
            } catch (err) {
              console.log("Technician Assignement error", err);
            } finally {
              setIsAssigning(false);
            }
          }}
        />
      )}
      {user?.role === "MANAGER" && (
  <RecurringMaintenance
    data={recurringData}
    isLoading={isRecurringLoading}
  />
)}
<MaintenancesUpdates updates={updates} />
{isAssignedTechnician && (
  <AddMaintenanceUpdate
    maintenanceId={maintenance._id}
    onUpdateCreated={async () => {
      const updatedData = await getMaintenanceUpdates(
        maintenance._id
      );

      setUpdates(updatedData);
    }}
  />
)}
    </div>
  );
}
export default MaintenanceDetailsPage;
