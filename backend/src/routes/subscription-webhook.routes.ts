import {Router} from 'express';
import  subscriptionController from '../controllers/subscription-webhook.controller.js'
const router = Router();
router.post('/',subscriptionController.handleWebhook)
export default router; 