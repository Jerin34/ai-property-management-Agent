import { Router } from "express"
import authenticate  from "../middleware/auth.middileware.js";
import subscriptionController from "../controllers/subscription.controller.js";
const router = Router()
router.post('/create',authenticate,subscriptionController.createSubsription)
export default router