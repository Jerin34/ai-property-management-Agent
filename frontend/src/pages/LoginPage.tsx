import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <img src="/propertyagent-mark.svg" alt="PropertyAgent logo" />
          </div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Welcome Back</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
            Sign in to your PropertyAgent workspace
          </p>
        </div>

        {loginError && <div className="alert-error" role="alert">{loginError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              name="Email"
              id="email"
              placeholder="e.g. manager@propertyagent.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ padding: "0.75rem", marginTop: "0.5rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
