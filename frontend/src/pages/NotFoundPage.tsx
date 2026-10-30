import { Link, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main
      className="auth-wrapper"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem 1rem",
      }}
    >
      <section
        className="auth-card"
        style={{
          width: "100%",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "var(--primary)",
            fontSize: "clamp(4rem, 12vw, 6rem)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.07em",
          }}
        >
          404
        </p>
        <h1 style={{ margin: "1.25rem 0 0.5rem", color: "var(--text-main)" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, color: "var(--text-muted)" }}>
          The page you are looking for may have been moved, deleted, or does
          not exist.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "1.75rem",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
