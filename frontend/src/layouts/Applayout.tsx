import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar.tsx";
import Navbar from "../components/Navbar.tsx";
function Applayout(){
    return(
        <div>
            <Sidebar />
            <div>
                <Navbar />
            
            <main>
                <Outlet  />
            </main>
            </div>
        </div>
    );
}
export default Applayout