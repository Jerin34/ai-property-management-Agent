import { useEffect, useState } from "react";
import { getMaintenanceCostAnalytics } from "../api/maintenance-cost-analytics.api";
import type { MaintenanceCostAnalytics } from "../types/maintenance-cost-analytics.types";

function MaintenanceCostAnalyticsPage() {
    const [analytics, setAnalytics] =
        useState<MaintenanceCostAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getMaintenanceCostAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to load maintenance cost analytics", err);
                setError("Failed to load maintenance cost analytics");
            } finally {
                setIsLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (isLoading) return <p>Loading maintenance cost analytics...</p>;
    if (error) return <p>{error}</p>;
    if (!analytics) return <p>No maintenance cost data available.</p>;

    return (
        <div>
            <h1>Maintenance Cost Analytics</h1>

            <div className="kpi-grid">
                <div>
                    <h3>Total Estimated Cost</h3>
                    <p>{analytics.totalEstimatedCost}</p>
                </div>
                <div>
                    <h3>Total Actual Cost</h3>
                    <p>{analytics.totalActualCost}</p>
                </div>
                <div>
                    <h3>Total Labor Cost</h3>
                    <p>{analytics.totalLaborCost}</p>
                </div>
                <div>
                    <h3>Total Material Cost</h3>
                    <p>{analytics.totalMaterialCost}</p>
                </div>
                <div>
                    <h3>Cost Variance</h3>
                    <p>{analytics.costVariance}</p>
                </div>
                <div>
                    <h3>Average Actual Cost</h3>
                    <p>{analytics.averageActualCost.toFixed(2)}</p>
                </div>
            </div>

            <h2>Most Expensive Request</h2>
            {analytics.mostExpensiveRequest ? (
                <div>
                    <p>{analytics.mostExpensiveRequest.title}</p>
                    <p>{analytics.mostExpensiveRequest.actualCost}</p>
                </div>
            ) : (
                <p>No completed cost data available.</p>
            )}

            <h2>Cost by Category</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Actual Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(analytics.byCategory).map(([category, cost]) => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>{cost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Cost by Property</h2>
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Actual Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {analytics.byProperty.map((property) => (
                        <tr key={property.propertyId}>
                            <td>{property.propertyName}</td>
                            <td>{property.actualCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MaintenanceCostAnalyticsPage;
