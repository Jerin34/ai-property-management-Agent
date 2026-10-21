import { useAuth } from "../context/Authcontext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="app-topbar">
      <div className="topbar-title">
        <span>AI Property Management</span>
        <span className="topbar-badge">Live Copilot</span>
      </div>
      <div className="topbar-user">
        <span className="badge badge-neutral">Role: {user?.role || "GUEST"}</span>
        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
          {user?.name}
        </span>
      </div>
    </header>
  );
}

export default Navbar;