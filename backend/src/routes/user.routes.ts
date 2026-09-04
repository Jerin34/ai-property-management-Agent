import {Router} from 'express';
import { autihorize } from "../middleware/role.middleware.js";
import authenticate from "../middleware/auth.middileware.js";
import {ROLES} from "../constants/roles.js";
import { updateUserSchema ,updateLocationSchema} from '../validator/user.validator.js';
import {updateTechnicianSkillsSchema} from '../validator/user.validator.js'
import { validate } from '../middleware/validator.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();
router.put('/:id/role',authenticate,autihorize(ROLES.Admin),validate(updateUserSchema),userController.updateRole)
router.patch("/:id/skills",authenticate,autihorize(ROLES.Admin),validate(updateTechnicianSkillsSchema),userController.updateTechnicianSkills)
router.patch(
    '/location',
    authenticate,
    validate(updateLocationSchema),
    userController.updateTechnicianLocation
);
export default router
