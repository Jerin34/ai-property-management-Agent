import { Router } from "express";
import authenticate from "../middleware/auth.middileware.js";
import { autihorize } from "../middleware/role.middleware.js";
import {ROLES}  from '../constants/roles.js'
import {validate} from '../middleware/validator.middleware.js' 
import { createMaintenanceSchema,AssignTechnicianSchema ,UpdatesTechnicianStatusSchema } from "../validator/maintenance.validator.js";
import * as maintainanceController from '../controllers/maintenance.controller.js'
const router = Router()
router.get('/insights',authenticate,autihorize(ROLES.Manager),
    maintainanceController.getManagerInsights)
router.post('/',authenticate,autihorize(ROLES.Tenant),validate(createMaintenanceSchema),maintainanceController.createMaintenance)

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
router.get('/:id',authenticate,autihorize(ROLES.Admin,ROLES.Manager,ROLES.Tenant),maintainanceController.getMaintenanceById)
router.get('/technician/my-requests',
    authenticate,
    autihorize(ROLES.Technician),
    maintainanceController.ViewTechnicianReq
)
router.get(
    "/:id/recurring",
    authenticate,
    autihorize(ROLES.Manager),
    maintainanceController.detectRecurring
)
// router.patch(
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