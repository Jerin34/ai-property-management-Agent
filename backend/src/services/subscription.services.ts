
import razorpay from "../config/razorpay.js";
import User from "../models/user.model.js";
import env from "../config/env.js";

const createSubscription = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Prevent an already subscribed user from starting checkout again.
    if (user.subscriptionStatus === "ACTIVE") {
        throw new Error("User already has an active subscription");
    }

    // Reuse an existing subscription when its checkout is still available.
    if (user.subscriptionId) {
        const existingSubscription =
            await razorpay.subscriptions.fetch(user.subscriptionId);

        if (
            existingSubscription.status === "created" &&
            existingSubscription.short_url
        ) {
            return {
                subscriptionId: existingSubscription.id,
                status: existingSubscription.status,
                shortUrl: existingSubscription.short_url,
            };
        }

        throw new Error(
            `Existing subscription cannot reuse checkout. ` +
            `Razorpay status: ${existingSubscription.status}`
        );
    }

    // Create a subscription only when the user has no existing subscription.
    const subscription = await razorpay.subscriptions.create({
        plan_id: env.RAZORPAY_PLAN_ID,
        total_count: 20,
        quantity: 1,
        customer_notify: 1,
        notes: {
            userId,
        },
    });

    user.subscriptionId = subscription.id;
    user.subscriptionStatus = "INACTIVE";

    await user.save();

    return {
        subscriptionId: subscription.id,
        status: subscription.status,
        shortUrl: subscription.short_url,
    };
};

const subscriptionService = {
    createSubscription,
};

export default subscriptionService;
