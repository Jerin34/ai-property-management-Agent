import {Router} from 'express';
import { autihorize } from "../middleware/role.middleware.js";
import authenticate from "../middleware/auth.middileware.js";
import {ROLES} from "../constants/roles.js";
import { updateUserSchema } from '../validator/user.validator.js';
import { validate } from '../middleware/validator.middleware.js';
import * as userController from '../controllers/user.controller.js';
import { ro } from 'zod/locales';
const router = Router();
router.put('/:id/role',authenticate,autihorize(ROLES.Admin),validate(updateUserSchema),userController.updateRole)
export default router