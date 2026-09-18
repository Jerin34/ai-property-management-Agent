import Router from 'express'
import { getMaintenanceCostPrediction} from '../controllers/maintenance_cost_prediction.controller.js'
import authenticate  from "../middleware/auth.middileware.js";
import {autihorize} from "../middleware/role.middleware.js"
import { ROLES } from "../constants/roles.js";
const router = Router()
router.get('/:id/predict',authenticate,autihorize(ROLES.Admin,ROLES.Manager),getMaintenanceCostPrediction)
export default router