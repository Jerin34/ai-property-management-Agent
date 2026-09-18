import Router from 'express'
import authenticate  from "../middleware/auth.middileware.js";
import {autihorize} from "../middleware/role.middleware.js"
import { getSLAmetrics } from '../controllers/maintenance_sla.controller.js';
import { ROLES } from "../constants/roles.js";
const router = Router();
router.get("/",authenticate,autihorize(ROLES.Admin,ROLES.Manager),getSLAmetrics);
export default router