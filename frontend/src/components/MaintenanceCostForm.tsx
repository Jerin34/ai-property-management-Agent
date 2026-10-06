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
    } catch (err) {
      console.log("Error updating maintenance cost", err);
      setIsError("Failed to update maintenance cost");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Update Repair Cost</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="laborCost">Labor Cost</label>

          <input
            id="laborCost"
            type="number"
            min="0"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="materialCost">Material Cost</label>

          <input
            id="materialCost"
            type="number"
            min="0"
            value={materialCost}
            onChange={(e) => setMaterialCost(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Cost"}
        </button>

        {isError && <p style={{ color: "red" }}>{isError}</p>}
      </form>
    </div>
  );
}

export default MaintenanceCostForm;