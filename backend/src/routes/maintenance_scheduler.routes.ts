import { Router } from 'express'
import {createSchedule,getSchedule,getScheduleById,getDueSchedules,processDueSchedules} from '../controllers/maintenance_scheduler.controller.js'
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
router.post('/process-due',authenticate,autihorize(ROLES.Admin, ROLES.Manager),processDueSchedules)
router.get(
    "/",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getSchedule
);
router.get(
    "/due",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getDueSchedules
);

router.get(
    "/:id",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    getScheduleById
);

export default router
