import { useEffect, useState } from "react";
import { getMaintenanceSLAMetrics } from "../api/maintenance-sla.api";
import type { MaintenanceSLAMetrics } from "../types/maintenance-sla.types";

function MaintenanceSLAPage() {
    const [metrics, setMetrics] =
        useState<MaintenanceSLAMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getMaintenanceSLAMetrics();
                setMetrics(data);
            } catch (err) {
                console.error("Failed to load SLA metrics", err);
                setError("Failed to load SLA metrics");
            } finally {
                setIsLoading(false);
            }
        };

        loadMetrics();
    }, []);

    if (isLoading) return <p>Loading SLA metrics...</p>;
    if (error) return <p>{error}</p>;
    if (!metrics) return <p>No SLA data available.</p>;

    return (
        <div>
            <h1>Maintenance SLA</h1>

            <div className="kpi-grid">
                <div>
                    <h3>Total Requests</h3>
                    <p>{metrics.totalRequests}</p>
                </div>
                <div>
                    <h3>Completed Requests</h3>
                    <p>{metrics.completedRequests}</p>
                </div>
                <div>
                    <h3>SLA Breaches</h3>
                    <p>{metrics.breachedRequests}</p>
                </div>
                <div>
                    <h3>Compliance Rate</h3>
                    <p>{metrics.complianceRate.toFixed(2)}%</p>
                </div>
                <div>
                    <h3>Average Resolution Time</h3>
                    <p>{metrics.averageResolutionTimeHours.toFixed(2)} hours</p>
                </div>
            </div>

            <h2>SLA by Priority</h2>

            <table>
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Total Requests</th>
                        <th>Breached</th>
                        <th>Compliance</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.byPriority.map((item) => (
                        <tr key={item.priority}>
                            <td>{item.priority}</td>
                            <td>{item.totalRequests}</td>
                            <td>{item.breachedRequests}</td>
                            <td>{item.complianceRate.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MaintenanceSLAPage;
