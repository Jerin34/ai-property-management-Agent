import { NavLink } from "react-router-dom";
import { NavigationItems } from "../routes/Navigation";
import { useAuth } from "../context/Authcontext";

function Sidebar(){
    const { user ,logout} = useAuth();
    const visibleItems = NavigationItems.filter((item) => item.allowedRoles.includes(user?.role));
    return(
        <aside>
            <h1>Property Management</h1>
            <nav>
               {
                visibleItems.map(
                    (item) =>(
                        <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
                    )
                )
               }
            </nav>
            <div>
                <p>{user?.name}</p>
                <p>{user?.role}</p>
                <button onClick={logout}>Logout</button>
            </div>
        </aside>
    )

}
export default Sidebar