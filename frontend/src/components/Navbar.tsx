
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="app-topbar">
      <div className="topbar-title">
        <span>Workspace</span>
        <span className="topbar-badge">
          AI-powered property operations
        </span>
      </div>

      <div className="topbar-user">
        <span className="badge badge-neutral">
          {user?.role || "GUEST"}
        </span>

        <span
          style={{
            fontWeight: 650,
            fontSize: "0.88rem",
            color: "var(--text-main)",
          }}
        >
          {user?.name}
        </span>

        <button
          type="button"
          className="btn btn-secondary btn-sm mobile-logout"
          onClick={logout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
