import { useEffect, useState } from "react";

import {

    getMaintenanceSchedules ,
    getDueMaintenanceSchedules,
    processDueMaintenanceSchedules
} from "../api/maintenance-scheduler.api";

import type {
    MaintenanceSchedule
} from "../types/maintenance-scheduler.types";

function MaintenanceSchedulerPage() {

    const [schedules, setSchedules] =
        useState<MaintenanceSchedule[]>([]);

    const [dueSchedules, setDueSchedules] =
        useState<MaintenanceSchedule[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

   const loadSchedules = async () => {

    try {

        const [allSchedules, due] =
            await Promise.all([
                getMaintenanceSchedules(),
                getDueMaintenanceSchedules()
            ]);

        setSchedules(allSchedules);
        setDueSchedules(due);

    } catch (err) {

        console.error(
            "Failed to load maintenance schedules",
            err
        );

        setError(
            "Failed to load maintenance schedules"
        );

    }
};

useEffect(() => {

    const loadInitialSchedules = async () => {

        try {

            setIsLoading(true);
            setError(null);

            await loadSchedules();

        } finally {

            setIsLoading(false);
        }

    };

    loadInitialSchedules();

}, []);

   const handleProcessDueSchedules = async () => {

    try {

        await processDueMaintenanceSchedules();

        await loadSchedules();

    } catch (err) {

        console.error(
            "Failed to process due schedules",
            err
        );
    }
};

    if (isLoading) {
        return <p>Loading maintenance schedules...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            <h1>Preventive Maintenance Scheduler</h1>

            <div className="kpi-grid">

                <div>
                    <h3>Total Schedules</h3>
                    <p>{schedules.length}</p>
                </div>

                <div>
                    <h3>Due Schedules</h3>
                    <p>{dueSchedules.length}</p>
                </div>

            </div>

            <button
                onClick={handleProcessDueSchedules}
                disabled={dueSchedules.length === 0}
            >
                Process Due Schedules
            </button>

            <h2>Maintenance Schedules</h2>

            <table>

                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Frequency</th>
                        <th>Next Due</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {schedules.map((schedule) => (

                        <tr key={schedule._id}>

                            <td>
                                {schedule.title}
                            </td>

                            <td>
                                {schedule.category}
                            </td>

                            <td>
                                {schedule.frequency}
                            </td>

                            <td>
                                {new Date(
                                    schedule.nextDueDate
                                ).toLocaleDateString()}
                            </td>
                           <td>
                                {schedule.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default MaintenanceSchedulerPage;
