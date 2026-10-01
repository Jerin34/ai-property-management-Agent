import { BrowserRouter,Routes,Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import RoleRoute from "./RoleRoute.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import DashBoardPage from "../pages/DashboardPage.tsx";
import PropertiesPage from "../pages/PropertiesPage.tsx";
import Applayout from "../layouts/Applayout.tsx";
import MaintenancePage from "../pages/MaintenancePage.tsx";
import PropertyDetailsPage from "../pages/PropertyDetailsPage.tsx";
function ManagerDashboardPage(){
    return (
    <h1>Manager Dashboard Page</h1>
    )
}
function AppRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Applayout/>}>
              <Route path="/dashboard" element={<DashBoardPage/>}/>
              <Route element = {<RoleRoute allowedRoles={['ADMIN','MANAGER']} />} >
              <Route path="/management" element={<ManagerDashboardPage/>}/>
              <Route path="/properties" element={<PropertiesPage/>} />
              <Route path="/properties/:id" element={<PropertyDetailsPage/>} />
              <Route path="/maintenance" element={<MaintenancePage/>}/>
              </Route>
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
    )
}
export default AppRoutes;