import { Router } from 'express';

import {
    getNotificationPreference,
    updateNotificationPreference
} from "../controllers/notification_preferences.controller.js";

import authenticate from "../middleware/auth.middileware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getNotificationPreference
);

router.patch(
    "/",
    authenticate,
    updateNotificationPreference
);

export default router;