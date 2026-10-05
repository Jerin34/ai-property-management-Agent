import type { MaintenanceUpdates } from "../types/maintenance.types";
interface MaintenanceUpdatesProps {
    updates: MaintenanceUpdates[]
}
function MaintenancesUpdates({
    updates
}:MaintenanceUpdatesProps) {
return (
    <div>
        <h1>Maintenance Updates</h1>
        { 
            updates.length === 0 ? (
                <div>
                    No Updates Yet.
                </div>
            ):(
                updates.map((update) => (
                    <div key={update._id}>
                        <p>{update.message}</p>
                    </div>
                ))
            )}

    </div>
);
}
export default MaintenancesUpdates;