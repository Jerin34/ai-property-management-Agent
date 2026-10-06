import { updateCost } from "../controllers/maintenance_cost.controller.js";
import Router from "express";
import { autihorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";
import authenticate from "../middleware/auth.middileware.js";
import { updateCost } from "../controllers/maintenance_cost.controller.js";

const router = Router();

router.patch(
    "/:id/cost",
    authenticate,
    autihorize(ROLES.Technician),
    updateCost
);

export default router;