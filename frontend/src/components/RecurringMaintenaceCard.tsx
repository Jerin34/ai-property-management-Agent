import type { RecurringMaintenance } from "../types/recurring-maintenance.types";

interface RecurringMaintenanceProps {
  data: RecurringMaintenance | null;
  isLoading: boolean;
}

function RecurringMaintenanceCard({
  data,
  isLoading,
}: RecurringMaintenanceProps) {
  if (isLoading) {
    return <p>Checking for recurring maintenance...</p>;
  }

  if (!data) {
    return <p>Recurring maintenance information unavailable.</p>;
  }

  return (
    <section>
      <h2>Recurring Maintenance</h2>

      <p>
        <strong>Recurring:</strong>{" "}
        {data.isRecurring ? "Yes" : "No"}
      </p>

      <p>
        <strong>Category:</strong> {data.category}
      </p>

      <p>
        <strong>Requests:</strong> {data.requestCount}
      </p>

      <p>
        <strong>Period:</strong> {data.periodDays} days
      </p>

      <p>
        <strong>Analysis:</strong> {data.message}
      </p>
    </section>
  );
}

export default RecurringMaintenanceCard;