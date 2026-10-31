import {Router} from 'express';
import { autihorize } from "../middleware/role.middleware.js";
import authenticate from "../middleware/auth.middileware.js";
import {ROLES} from "../constants/roles.js";
import {
    updateUserSchema,
    updateLocationSchema,
    updateTechnicianProfileSchema,
} from '../validator/user.validator.js';
import {updateTechnicianSkillsSchema} from '../validator/user.validator.js'
import { validate } from '../middleware/validator.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.get(
    "/technician-role-application/status",
    authenticate,
    autihorize(ROLES.Tenant),
    userController.getMyTechnicianApplicationStatus
);
router.post(
    "/technician-role-application",
    authenticate,
    autihorize(ROLES.Tenant),
    userController.applyForTechnicianRole
);
router.get(
    "/technician-role-approvals/pending",
    authenticate,
    autihorize(ROLES.Admin),
    userController.getPendingTechnicianRoleApprovals
);
router.patch(
    "/:id/technician-role-approval/approve",
    authenticate,
    autihorize(ROLES.Admin),
    userController.approveTechnicianRoleRequest
);
router.patch(
    "/:id/technician-role-approval/reject",
    authenticate,
    autihorize(ROLES.Admin),
    userController.rejectTechnicianRoleRequest
);
router.get(
    "/technician/profile",
    authenticate,
    autihorize(ROLES.Technician),
    userController.getTechnicianProfile
);
router.patch(
    "/technician/profile",
    authenticate,
    autihorize(ROLES.Technician),
    validate(updateTechnicianProfileSchema),
    userController.updateTechnicianProfile
);

router.get(
    "/role-approvals/pending",
    authenticate,
    autihorize(ROLES.Admin),
    userController.getPendingApprovals
);

router.put('/:id/role',authenticate,autihorize(ROLES.Admin),validate(updateUserSchema),userController.updateRole)
router.patch("/:id/skills",authenticate,autihorize(ROLES.Admin),validate(updateTechnicianSkillsSchema),userController.updateTechnicianSkills)
router.patch(
    '/location',
    authenticate,
    validate(updateLocationSchema),
    userController.updateTechnicianLocation
);
router.patch(
    "/:id/role-approval/approve",
    authenticate,
    autihorize(ROLES.Admin),
    userController.approveManagerRoleRequest
);
router.patch(
    "/:id/role-approval/reject",
    authenticate,
    autihorize(ROLES.Admin),
    userController.rejectManagerRoleRequest
)

export default router
