import { Router } from "express";
import authenticate from "../middleware/auth.middileware.js";
import { autihorize } from "../middleware/role.middleware.js";
import {ROLES}  from '../constants/roles.js'
import {validate} from '../middleware/validator.middleware.js' 
import upload from '../middleware/upload.middleware.js'
import { createMaintenanceSchema,AssignTechnicianSchema ,UpdatesTechnicianStatusSchema } from "../validator/maintenance.validator.js";
import * as maintainanceController from '../controllers/maintenance.controller.js'
import { maintenanceIpLimiter,maintenanceTenantLimiter } from "../middleware/maintenance-rate-limit.middleware.js";
const router = Router()
router.post(
  "/",
  maintenanceIpLimiter,
  authenticate,
  autihorize(ROLES.Tenant),
  maintenanceTenantLimiter,
  upload.array("photos", 5),
  validate(createMaintenanceSchema),
  maintainanceController.createMaintenance
);
router.get('/alerts',authenticate,autihorize(ROLES.Admin,ROLES.Manager),maintainanceController.getMaintenanceAlert)
router.get('/insights',authenticate,autihorize(ROLES.Manager),
    maintainanceController.getManagerInsights)

router.get(
    "/",
    authenticate,
    autihorize(
        ROLES.Admin,
        ROLES.Manager,
        ROLES.Tenant
    ),
    maintainanceController.getMaintnence
);
router.get('/technician/my-requests',
    authenticate,
    autihorize(ROLES.Technician),
    maintainanceController.ViewTechnicianReq
)
router.get('/:id',authenticate,autihorize(ROLES.Admin,ROLES.Manager,ROLES.Tenant,ROLES.Technician),maintainanceController.getMaintenanceById)
router.get(
    "/:id/recurring",
    authenticate,
    autihorize(ROLES.Manager),
    maintainanceController.detectRecurring
)

router.get(
    "/:id/recommend-technician",
    authenticate,
    autihorize(ROLES.Manager),
    maintainanceController.recommendTechnician
);
router.patch(
    "/:id/assign",
    authenticate,
    autihorize(ROLES.Manager),
    validate(AssignTechnicianSchema ),
    maintainanceController.assignTechnicain
);
router.patch('/:id/status',
    authenticate,
    autihorize(ROLES.Technician),
    validate(UpdatesTechnicianStatusSchema),
    maintainanceController.updateMaintenanceStatus
)

export default router



// 6a8e885d641fb3e78c26e51f