
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const {
    user,
    isLoading,
    sessionError,
    retrySession,
  } = useAuth();

  if (isLoading) {
    return <div>Restoring session...</div>;
  }

  if (sessionError) {
    return (
      <div>
        <h2>Session verification failed</h2>

        <p>{sessionError}</p>

        <button
          type="button"
          onClick={() => void retrySession()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
