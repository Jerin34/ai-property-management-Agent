import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import RoleRoute from "./RoleRoute.tsx";

import LoginPage from "../pages/LoginPage.tsx";
import DashBoardPage from "../pages/DashboardPage.tsx";
import PropertiesPage from "../pages/PropertiesPage.tsx";
import Applayout from "../layouts/Applayout.tsx";

import MaintenancePage from "../pages/MaintenancePage.tsx";
import PropertyDetailsPage from "../pages/PropertyDetailsPage.tsx";
import MaintenanceDetailsPage from "../pages/MaintenanceDetailsPage.tsx";
import CreateMaintenancePage from "../pages/CreateMaintenancePage.tsx";
import NotificationPage from "../pages/NotificationPage.tsx";
import TechnicianMaintenancePage from "../pages/TechnicianMaintenancePage.tsx";
import MaintenanceSLAPage from "../pages/MaintenanceSLAPage.tsx";
function ManagerDashboardPage() {
  return <h1>Manager Dashboard Page</h1>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* All authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Applayout />}>
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
              <Route path="/analytics" element={<DashBoardPage />} />
              <Route path="/maintenance/sla" element={<MaintenanceSLAPage />} />
            </Route>

            {/* Maintenance is accessible to authenticated roles */}
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route element={<RoleRoute allowedRoles={["TENANT"]} />}>
              <Route
                path="/maintenance/create"
                element={<CreateMaintenancePage />}
              />
            </Route>

            <Route
              path="/maintenance/:id"
              element={<MaintenanceDetailsPage />}
            />

            {/* {Technician} */}
            <Route element={<RoleRoute allowedRoles={["TECHNICIAN"]} />}>
              <Route
                path="/technician/maintenance"
                element={<TechnicianMaintenancePage />}
              />
            </Route>

            {/* Admin / Manager only */}
            <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
              <Route path="/management" element={<ManagerDashboardPage />} />

              <Route path="/properties" element={<PropertiesPage />} />
              
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
