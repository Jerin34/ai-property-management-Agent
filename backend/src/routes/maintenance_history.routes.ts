import Router from 'express'
import authenticate  from "../middleware/auth.middileware.js";
import {autihorize} from "../middleware/role.middleware.js"
import { ROLES } from "../constants/roles.js";
import { viewMaintenanceHistory } from '../controllers/maintenance_history.controller.js';
const router = Router()
router.get('/my_history',authenticate,autihorize(ROLES.Tenant),viewMaintenanceHistory);
export default router