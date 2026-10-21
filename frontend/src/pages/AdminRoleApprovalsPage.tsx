
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
    approveManagerRoleRequest,
    getPendingApprovals,
    rejectManagerRoleRequest,
} from "../api/role-approvals.api";
import type { RoleApprovalRequest } from "../api/role-approvals.api";

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ??
            "The request failed. Please try again."
        );
    }

    return error instanceof Error
        ? error.message
        : "Something went wrong.";
}

function AdminRoleApprovalsPage() {
    const [requests, setRequests] = useState<RoleApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadRequests = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getPendingApprovals();
            setRequests(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

   useEffect(() => {
    let cancelled = false;

    const fetchRequests = async () => {
        try {
            const data = await getPendingApprovals();

            if (!cancelled) {
                setRequests(data);
                setError("");
            }
        } catch (err) {
            if (!cancelled) {
                setError(getErrorMessage(err));
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    void fetchRequests();

    return () => {
        cancelled = true;
    };
}, []);
    const handleDecision = async (
        userId: string,
        action: "approve" | "reject"
    ): Promise<void> => {
        const confirmed = window.confirm(
            action === "approve"
                ? "Approve this user's Manager role?"
                : "Reject this user's Manager role request?"
        );

        if (!confirmed) {
            return;
        }

        setProcessingId(userId);
        setError("");
        setMessage("");

        try {
            if (action === "approve") {
                await approveManagerRoleRequest(userId);
                setMessage("User's Manager role approved successfully.");
            } else {
                await rejectManagerRoleRequest(userId);
                setMessage("Manager role request rejected.");
            }

            await loadRequests();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <section className="admin-role-approvals">
            <header className="admin-role-approvals__header">
                <div>
                    <h1>Manager Role Approvals</h1>
                    <p>
                        Review tenants with verified subscription payments
                        awaiting Admin approval.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void loadRequests()}
                    disabled={loading || processingId !== null}
                >
                    Refresh
                </button>
            </header>

            {message && (
                <p role="status" className="approval-success">
                    {message}
                </p>
            )}

            {error && (
                <p role="alert" className="approval-error">
                    {error}
                </p>
            )}

            {loading ? (
                <p>Loading approval requests...</p>
            ) : requests.length === 0 ? (
                <div className="approval-empty">
                    <h2>No pending requests</h2>
                    <p>
                        Requests will appear here after a verified
                        successful payment creates a pending approval.
                    </p>
                </div>
            ) : (
                <div className="approval-table-wrapper">
                    <table className="approval-table">
                        <thead>
                            <tr>
                                <th>Tenant</th>
                                <th>Email</th>
                                <th>Request date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td>
                                        {request.roleApprovalRequesteAt
                                            ? new Date(
                                                  request.roleApprovalRequesteAt
                                              ).toLocaleString()
                                            : "Not available"}
                                    </td>
                                    <td>{request.roleApprovalStatus}</td>
                                    <td>
                                        <div className="approval-actions">
                                            <button
                                                type="button"
                                                disabled={processingId !== null}
                                                onClick={() =>
                                                    void handleDecision(
                                                        request._id,
                                                        "approve"
                                                    )
                                                }
                                            >
                                                {processingId === request._id
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={processingId !== null}
                                                onClick={() =>
                                                    void handleDecision(
                                                        request._id,
                                                        "reject"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AdminRoleApprovalsPage;
