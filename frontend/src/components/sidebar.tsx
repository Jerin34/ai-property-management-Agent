import { NavLink } from "react-router-dom";
import { NavigationItems } from "../routes/Navigation";
import { useAuth } from "../context/useAuth";

const navigationIcons: Record<string, string> = {
  Dashboard: "⌂",
  "Tenant Requests": "↗",
  "My Property": "⌂",
  Properties: "▦",
  Maintenance: "⌁",
  Analytics: "▥",
  "Cost Analytics": "◫",
  notification: "◉",
  "My Maintenance": "✓",
  "Maintenance Schedules": "◷",
};

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
        <img
          className="sidebar-brand-mark"
          src="/propertyagent-mark.svg"
          alt=""
          aria-hidden="true"
        />
        <div>
          <h2 className="sidebar-logo-text">PropertyAgent</h2>
          <div className="sidebar-logo-sub">AI PROPERTY MANAGEMENT</div>
        </div>
      </div>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="sidebar-nav-icon" aria-hidden="true">
              {navigationIcons[item.label] ?? "◇"}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">{getInitials(user?.name)}</div>
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
