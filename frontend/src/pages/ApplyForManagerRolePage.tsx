
import { useState } from "react";
import axios from "axios";
import apiClient from "../api/client";

interface SubscriptionResponse {
  subscriptionId: string;
  status: string;
  shortUrl: string;
}

interface CreateSubscriptionResponse {
  success: boolean;
  subscription: SubscriptionResponse;
  message: string;
}

const ApplyForManagerRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [alreadyPaid,setAlreadyPaid] = useState(false);

 
const handleApply = async () => {
  if (!accepted || loading) return;

  const paymentTab = window.open("about:blank", "_blank");

  if (!paymentTab) {
    setError("Please allow pop-ups to continue to payment.");
    return;
  }

  // Prevent the payment tab from accessing the original app tab.
  paymentTab.opener = null;

  setLoading(true);
  setError("");

  try {
    const response =
      await apiClient.post<CreateSubscriptionResponse>(
        "/subscriptions/create"
      );

    const result = response.data.subscription;

    if (!result?.shortUrl) {
      throw new Error("Checkout URL was not returned by the server.");
    }
    // Navigate the newly opened tab to Razorpay.
    paymentTab.location.replace(result.shortUrl);
  } catch (err) {
  paymentTab.close();

  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;

    if (
  message === "User already has an active subscription" ||
  message === "You are already subscribed"
) {
  setAlreadyPaid(true);
  setError("");
} else {
  setError(
    message || "Failed to create subscription. Please try again."
  );
}
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong.");
  }
} finally {
  setLoading(false);
}
};

  return (
    <main className="mx-auto max-w-2xl p-6">
      <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Apply for Manager Role
        </h1>

        <p className="mt-3 text-gray-600">
          Upgrade your account to access property management
          features. Your application requires admin approval.
        </p>

        <div className="my-6 rounded-xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Monthly subscription
          </p>

          <p className="mt-1 text-3xl font-bold">
            ₹20
            <span className="text-base font-normal text-gray-500">
              {" "}/ month
            </span>
          </p>

          <p className="mt-3 text-sm text-gray-600">
            After payment is verified, your application can be
            reviewed by an admin. Your role remains Tenant
            until approval.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
          />

          <span className="text-sm leading-6 text-gray-700">
            I understand that after successful payment, the admin
            may need some time to review my application and update
            my role. My manager role will become active only after
            admin approval.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
  type="button"
  onClick={handleApply}
  disabled={loading || !accepted || alreadyPaid}
  className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {alreadyPaid
    ? "Already Paid"
    : loading
      ? "Creating subscription..."
      : "Accept & Continue to Payment"}
</button>
        {alreadyPaid && (
  <p className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
    You have already completed your subscription payment.
    Please allow some time for the admin to review your
    application and update your role.
  </p>
)}
      </section>
    </main>
  );
};

export default ApplyForManagerRolePage;
