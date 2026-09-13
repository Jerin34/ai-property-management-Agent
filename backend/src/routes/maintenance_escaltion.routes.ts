import Router from 'express'
import { getMaintenanceEscalation } from '../controllers/maintenance.escalation.controller.js'
import authenticate  from "../middleware/auth.middileware.js";
import {autihorize} from "../middleware/role.middleware.js"
import { ROLES } from "../constants/roles.js";
const router = Router();
router.post(
    "/process",
 authenticate,
 autihorize(ROLES.Admin,ROLES.Manager),
 getMaintenanceEscalation  
)
export default router