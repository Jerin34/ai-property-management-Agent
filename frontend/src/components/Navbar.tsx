import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="app-topbar">
      <div className="topbar-title">
        <span>Workspace</span>
        <span className="topbar-badge">AI-powered property operations</span>
      </div>
      <div className="topbar-user">
        <span className="badge badge-neutral">{user?.role || "GUEST"}</span>
        <span style={{ fontWeight: 650, fontSize: "0.88rem", color: "var(--text-main)" }}>
          {user?.name}
        </span>
      </div>
    </header>
  );
}

export default Navbar;
