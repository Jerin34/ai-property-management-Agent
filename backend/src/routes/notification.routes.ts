import { Router } from "express";
import {ROLES} from '../constants/roles.js'
import {autihorize} from '../middleware/role.middleware.js'
import {
    createNotifications,
    getNotification,
    markasReadNotifications
} from "../controllers/notification.controller.js";

import authenticate from "../middleware/auth.middileware.js";
import { generateNotification } from "../controllers/notification.controller.js";

const router = Router();

router.post(
    "/",
    authenticate,
    autihorize(ROLES.Admin,ROLES.Manager),
    createNotifications
);
router.post("/generate_from_alerts",authenticate,autihorize(ROLES.Admin,ROLES.Manager),generateNotification);
router.get(
    "/",
    authenticate,
    getNotification
);

router.patch(
    "/read",
    authenticate,
    markasReadNotifications
);

export default router;