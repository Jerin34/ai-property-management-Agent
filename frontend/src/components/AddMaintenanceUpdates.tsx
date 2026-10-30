import { useState } from "react";
import { createMaintenanceUpdate } from "../api/maintenance.api";

interface AddMaintenanceUpateProps {
  maintenanceId: string;
  onUpdateCreated: () => void;
}

function AddMaintenanceUpdate({
  maintenanceId,
  onUpdateCreated,
}: AddMaintenanceUpateProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Update Message Cannot Be Empty");
      return;
    }
    const trimmedMessage = message.trim();
   if (trimmedMessage.length < 10) {
  setError("Update message must contain at least 10 characters.");
  return;
}

if (trimmedMessage.length > 500) {
  setError("Update message cannot exceed 500 characters.");
  return;
}
    try {
      setIsLoading(true);
      setError(null);
      await createMaintenanceUpdate(maintenanceId, {
        message: message.trim(),
      });
      setMessage("");
      onUpdateCreated();
    } catch (err) {
      console.log("Error in creating Maintenance Updates", err);
      setError("Failed to create maintenance update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 className="card-title">Add Work Update</h3>
      {error && <div className="alert-error">{error}</div>}
      <div className="form-group">
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter maintenance update or repair progress details..."
          disabled={isLoading}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Adding Update..." : "Post Update"}
        </button>
      </div>
    </div>
  );
}

export default AddMaintenanceUpdate;