import { useState } from "react";
import { updateMaintenanceCost } from "../api/maintenance.api";

interface MaintenanceCostFormProps {
  maintenanceId: string;
  onCostUpdate: () => void;
}

function MaintenanceCostForm({
  maintenanceId,
  onCostUpdate,
}: MaintenanceCostFormProps) {
  const [laborCost, setLaborCost] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setIsError(null);

      const costData: {
        laborCost?: number;
        materialCost?: number;
      } = {};

      if (laborCost !== "") {
        costData.laborCost = Number(laborCost);
      }

      if (materialCost !== "") {
        costData.materialCost = Number(materialCost);
      }

      if (Object.keys(costData).length === 0) {
        setIsError("Enter at least one cost");
        return;
      }

      await updateMaintenanceCost(maintenanceId, costData);

      setLaborCost("");
      setMaterialCost("");

      onCostUpdate();
    } catch {
      setIsError("Failed to update maintenance cost");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 className="card-title">Update Actual Repair Costs</h3>

      {isError && <div className="alert-error">{isError}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="laborCost">
              Labor Cost ($)
            </label>
            <input
              id="laborCost"
              type="number"
              min="0"
              placeholder="0.00"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="materialCost">
              Material Cost ($)
            </label>
            <input
              id="materialCost"
              type="number"
              min="0"
              placeholder="0.00"
              value={materialCost}
              onChange={(e) => setMaterialCost(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Save Actual Costs"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MaintenanceCostForm;