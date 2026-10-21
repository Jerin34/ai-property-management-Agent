
import { useNavigate } from "react-router-dom";

const WaitingForApprovalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
          ✓
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Application Submitted!
        </h1>

        <p className="mb-6 text-gray-600">
          Thank you for completing the subscription process.
          Please wait for some time while the admin reviews
          and approves your manager role application.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WaitingForApprovalPage;
