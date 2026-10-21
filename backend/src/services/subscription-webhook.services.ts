
import User from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";

type SubscriptionWebhookEvent =
    | "subscription.activated"
    | "subscription.charged"
    | "subscription.halted"
    | "subscription.cancelled"
    | "subscription.completed";

interface RazorpaySubscriptionEntity {
    id: string;
    status?: string;
    current_end?: number | null;
}

interface RazorpayPaymentEntity {
    id: string;
    status?: string;
    amount?: number;
    currency?: string;
}

interface RazorpayWebhookPayload {
    event: string;
    payload?: {
        subscription?: {
            entity?: RazorpaySubscriptionEntity;
        };
        payment?: {
            entity?: RazorpayPaymentEntity;
        };
    };
}

const processEventWebhook = async (
    eventData: RazorpayWebhookPayload
): Promise<void> => {
    const supportedEvents: SubscriptionWebhookEvent[] = [
        "subscription.activated",
        "subscription.charged",
        "subscription.halted",
        "subscription.cancelled",
        "subscription.completed",
    ];

    if (
        !supportedEvents.includes(
            eventData.event as SubscriptionWebhookEvent
        )
    ) {
        return;
    }
    console.log("Processing subscription event:", eventData.event);

    const subscription = eventData.payload?.subscription?.entity;

    if (!subscription?.id) {
        throw new Error("Missing Subscription Id in webhook payload");
    }

    const user = await User.findOne({
        subscriptionId: subscription.id,
    });

    if (!user) {
        throw new Error("User not found for subscription id");
    }

    switch (eventData.event) {
        case "subscription.activated": {
            user.subscriptionStatus = "ACTIVE";
            break;
        }

        case "subscription.charged": {
            const payment = eventData.payload?.payment?.entity;

            if (!payment?.id) {
                throw new Error("Missing payment details");
            }

            // Do not trust the event name alone.
            if (
                payment.status !== "captured" ||
                payment.amount !== 2000 ||
                payment.currency !== "INR"
            ) {
                throw new Error(
                    "Payment is not verified as a successful ₹20 charge"
                );
            }

            const processedIds =
                user.processedSubscriptionPaymentIds ?? [];

            // Avoid processing the same payment twice.
            if (processedIds.includes(payment.id)) {
                return;
            }

            user.subscriptionStatus = "ACTIVE";
            user.processedSubscriptionPaymentIds = [
                ...processedIds,
                payment.id,
            ];

            // Create an approval request; never promote automatically.
            if (
                user.role === ROLES.Tenant && 
                (user.roleApprovalStatus === "NOT_REQUESTED" || user.roleApprovalStatus == null)
            ) {
                user.roleApprovalStatus = "PENDING";
                user.roleApprovalRequestedAt = new Date();
            }

            break;
        }

        case "subscription.halted": {
            user.subscriptionStatus = "PAST_DUE";
            break;
        }

        case "subscription.cancelled":
        case "subscription.completed": {
            user.subscriptionStatus = "CANCELLED";
            break;
        }
    }

    if (subscription.current_end) {
        user.subscriptionCurrentPeriodEnd = new Date(
            subscription.current_end * 1000
        );
    }

    await user.save();
};

const subscriptionWebhook = {
    processEventWebhook,
};

export default subscriptionWebhook;
