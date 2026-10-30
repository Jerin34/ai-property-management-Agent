import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      await apiClient.post("/auth/register", {
        name, email, password, ...(phone.trim() && { phone: phone.trim() }),
      });
      setSuccessMessage("Account created successfully! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-brand">
          <div className="auth-logo">
            <img src="/propertyagent-mark.svg" alt="PropertyAgent logo" />
          </div>
          <h1 id="register-title" style={{ fontSize: "1.6rem", marginBottom: ".25rem" }}>
            Create your account
          </h1>
          <p className="auth-intro">Join PropertyAgent to manage property operations in one place.</p>
        </div>
        {errorMessage && <div className="alert-error" role="alert">{errorMessage}</div>}
        {successMessage && <div className="alert-success" role="status">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="Enter your name"
              value={name} onChange={(event) => setName(event.target.value)}
              required minLength={2} autoComplete="name" disabled={isLoading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com"
              value={email} onChange={(event) => setEmail(event.target.value)}
              required autoComplete="email" disabled={isLoading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="At least 8 characters"
              value={password} onChange={(event) => setPassword(event.target.value)}
              required minLength={8} autoComplete="new-password" disabled={isLoading} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone number <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
            </label>
            <input id="phone" name="phone" type="tel" placeholder="Enter your phone number"
              value={phone} onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel" disabled={isLoading} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </div>
  );
}

export default RegisterPage;
