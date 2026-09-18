import Router from 'express'
import authenticate  from "../middleware/auth.middileware.js";
import {autihorize} from "../middleware/role.middleware.js"
import { ROLES } from "../constants/roles.js";
import {maintenanceCostAnalytics} from "../controllers/maitenance-cost-analytics.controller.js"

const router = Router();

router.get('/', authenticate, autihorize(ROLES.Admin,ROLES.Manager), maintenanceCostAnalytics)
export default router
