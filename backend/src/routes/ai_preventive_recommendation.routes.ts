import Router from "express";

import authenticate from "../middleware/auth.middileware.js";
import { autihorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

import {
    getPreventiveRecommendations
} from "../controllers/ai_preventive_recommendation.controller.js";

const router = Router();

router.get(
    "/:id/recommendations",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getPreventiveRecommendations
);

export default router;