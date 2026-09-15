import Router from "express";

import {
    getAnalytics
} from "../controllers/maintenance-analytics.controller.js";

import authenticate
    from "../middleware/auth.middileware.js";

import {
    autihorize
} from "../middleware/role.middleware.js";

import {
    ROLES
} from "../constants/roles.js";
const router = Router();

router.get(
    "/",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getAnalytics
);
export default router;