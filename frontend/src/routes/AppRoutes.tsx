import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import RoleRoute from "./RoleRoute.tsx";

import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
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
import MaintenanceCostAnalyticsPage from "../pages/MaintenanceCostAnalyticsPage.tsx";
import MaintenanceSchedulerPage from "../pages/MaintenanceSchedulePage.tsx";
import CreateMaintenanceSchedulePage from "../pages/CreateMaintenanceSchedulePage.tsx";
import CreatePropertyPage from "../pages/CreatePropertyPage.tsx";

import AdminRoleApprovalsPage from "../pages/AdminRoleApprovalsPage.tsx";
import ApplyForTechnicianRolePage from "../pages/ApplyForTechnicianRolePage.tsx";
import AdminTechnicianRoleApprovalsPage from "../pages/AdminTechnicianRoleApprovalsPage.tsx";
import TechnicianProfilePage from "../pages/TechnicianProfilePage.tsx";
import ApplyForManagerPage from "../pages/ApplyForManagerRolePage.tsx";
import TenantPropertyPage from "../pages/TenantPropertyPage.tsx";
import TenantRequestsPage from "../pages/TenantRequestsPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Applayout />}>
            <Route path="/dashboard" element={<DashBoardPage />} />

            <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
              <Route path="/analytics" element={<DashBoardPage />} />
              <Route path="/maintenance/sla" element={<MaintenanceSLAPage />} />
              <Route
                path="/maintenance/cost-analytics"
                element={<MaintenanceCostAnalyticsPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
              <Route
                path="/properties/create"
                element={<CreatePropertyPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["MANAGER"]} />}>
              <Route path="/tenant-requests" element={<TenantRequestsPage />} />
            </Route>

            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/notification" element={<NotificationPage />} />

            <Route element={<RoleRoute allowedRoles={["TENANT"]} />}>
              <Route
                path="/maintenance/create"
                element={<CreateMaintenancePage />}
              />
              <Route path="/my-property" element={<TenantPropertyPage />} />
              <Route
                path="/apply-for-manager"
                element={<ApplyForManagerPage />}
              />
            </Route>

            <Route
              path="/maintenance/:id"
              element={<MaintenanceDetailsPage />}
            />

            <Route element={<RoleRoute allowedRoles={["TECHNICIAN"]} />}>
              <Route
                path="/technician/maintenance"
                element={<TechnicianMaintenancePage />}
              />
              <Route path="/technician/profile" element={<TechnicianProfilePage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route
                path="/admin/role-approvals"
                element={<AdminRoleApprovalsPage />}
              />
              <Route
                path="/admin/technician-role-approvals"
                element={<AdminTechnicianRoleApprovalsPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
              <Route path="/properties" element={<PropertiesPage />} />
              <Route
                path="/maintenance/schedules"
                element={<MaintenanceSchedulerPage />}
              />
              <Route
                path="/maintenance/schedules/create"
                element={<CreateMaintenanceSchedulePage />}
              />
              <Route
                path="/properties/:id"
                element={<PropertyDetailsPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Keep the fallback outside protected routes so unknown URLs render 404. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
