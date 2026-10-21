import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/user.model.js", () => ({
    default: {
        findOne: vi.fn(),
    },
}));

import User from "../models/user.model.js";
import subscriptionWebhook from "./subscription-webhook.services.js";

describe("Subscription webhook service", () => {
    const save = vi.fn();

    const mockUser = (overrides = {}) => ({
        role: "TENANT",
        subscriptionStatus: "INACTIVE",
        roleApprovalStatus: undefined,
        processedSubscriptionPaymentIds: [],
        save,
        ...overrides,
    });

    const chargedEvent = {
        event: "subscription.charged",
        payload: {
            subscription: {
                entity: {
                    id: "sub_test_123",
                    current_end: 1790000000,
                },
            },
            payment: {
                entity: {
                    id: "pay_test_123",
                    status: "captured",
                    amount: 2000,
                    currency: "INR",
                },
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        save.mockResolvedValue(undefined);
    });

    it("creates a pending approval for a Tenant with a valid captured payment", async () => {
        const user = mockUser();

        vi.mocked(User.findOne).mockResolvedValue(user as never);

        await subscriptionWebhook.processEventWebhook(chargedEvent);

        expect(user.subscriptionStatus).toBe("ACTIVE");
        expect(user.roleApprovalStatus).toBe("PENDING");
        expect(user.role).toBe("TENANT");
        expect(user.processedSubscriptionPaymentIds).toContain(
            "pay_test_123",
        );
        expect(save).toHaveBeenCalledOnce();
    });

    it("rejects an invalid payment", async () => {
        const user = mockUser();

        vi.mocked(User.findOne).mockResolvedValue(user as never);

        const invalidEvent = {
            ...chargedEvent,
            payload: {
                ...chargedEvent.payload,
                payment: {
                    entity: {
                        id: "pay_invalid",
                        status: "failed",
                        amount: 2000,
                        currency: "INR",
                    },
                },
            },
        };

        await expect(
            subscriptionWebhook.processEventWebhook(invalidEvent),
        ).rejects.toThrow("Payment is not verified");

        expect(save).not.toHaveBeenCalled();
        expect(user.role).toBe("TENANT");
    });

    it("does not process the same payment twice", async () => {
        const user = mockUser({
            processedSubscriptionPaymentIds: ["pay_test_123"],
        });

        vi.mocked(User.findOne).mockResolvedValue(user as never);

        await subscriptionWebhook.processEventWebhook(chargedEvent);

        expect(save).not.toHaveBeenCalled();
        expect(user.role).toBe("TENANT");
    });
});