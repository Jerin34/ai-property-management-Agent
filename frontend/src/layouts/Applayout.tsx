import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

function Applayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-layout">
        <Navbar />
        <main className="app-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Applayout;