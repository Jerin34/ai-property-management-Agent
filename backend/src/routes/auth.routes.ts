import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {validate} from "../middleware/validator.middleware.js";
import { registerSchema } from "../validator/auth.validator.js";
import authenticate from "../middleware/auth.middileware.js";
const router = Router()
router.post('/register',validate(registerSchema),authController.register)
router.get('/me',authenticate,authController.me)

export default router;