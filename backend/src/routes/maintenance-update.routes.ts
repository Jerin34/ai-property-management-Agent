import { Router } from "express";
import authenticate from "../middleware/auth.middileware.js";
import { validate } from "../middleware/validator.middleware.js";
import { MaintenanceupdateSchema  } from "../validator/maintenance.validator.js";
import * as maintenanceUpdateController from "../controllers/maintenance-update.controller.js";

const router = Router();

router.post(
    "/:id/updates",
    authenticate,
    validate(MaintenanceupdateSchema),
    maintenanceUpdateController.createMaintenaceUpdate
);
router.get('/:id/updates',authenticate,maintenanceUpdateController.viewMaintenaceReq);
export default router;
