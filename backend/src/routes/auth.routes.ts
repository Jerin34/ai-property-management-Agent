import { Router } from "express";
import authController from "../controllers/auth.controller.js";

import { autihorize } from "../middleware/role.middleware.js";
import {ROLES} from "../constants/roles.js"
import {validate} from "../middleware/validator.middleware.js";
import { registerSchema, loginSchema } from "../validator/auth.validator.js";
import authenticate from "../middleware/auth.middileware.js";
const router = Router()
router.post('/register',validate(registerSchema),authController.register)
router.get('/me',authenticate,autihorize(ROLES.Admin,ROLES.Manager,ROLES.Tenant),authController.me)
router.post('/login',validate(loginSchema),authController.loginUser)

export default router;