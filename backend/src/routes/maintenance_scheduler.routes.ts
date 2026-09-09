import { Router } from 'express'
import {createSchedule,getSchedule,getScheduleById} from '../controllers/maintenance_scheduler.controller.js'
import authenticate from "../middleware/auth.middileware.js";
import {autihorize} from '../middleware/role.middleware.js'
import {ROLES} from '../constants/roles.js'
const router = Router()
router.post(
    "/",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    createSchedule
);

router.get(
    "/",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getSchedule
);

router.get(
    "/:id",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getScheduleById
);
export default router
