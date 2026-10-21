import { NavLink } from "react-router-dom";
import { NavigationItems } from "../routes/Navigation";
import { useAuth } from "../context/Authcontext";

function Sidebar() {
  const { user, logout } = useAuth();

  const visibleItems = NavigationItems.filter(
    (item) =>
      !item.allowedRoles ||
      (user?.role && item.allowedRoles.includes(user.role))
  );

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-header">
        <div className="sidebar-logo-icon">AI</div>
        <div>
          <h2 className="sidebar-logo-text">EstatePulse</h2>
          <div className="sidebar-logo-sub">Property AI Agent</div>
        </div>
      </div>

      <nav className="app-sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="sidebar-user-details">
            <p className="sidebar-user-name">{user?.name || "User"}</p>
            <p className="sidebar-user-role">{user?.role || "GUEST"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm btn-block"
          type="button"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;