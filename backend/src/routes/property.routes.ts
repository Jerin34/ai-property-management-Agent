import {Router} from 'express'
import authenticate from '../middleware/auth.middileware.js'
import {validate} from '../middleware/validator.middleware.js'
import {autihorize} from '../middleware/role.middleware.js'
import {ROLES} from '../constants/roles.js'
import {createPropertySchema} from  '../validator/property.validator.js'
import * as propertyController from '../controllers/property.controller.js'
const router = Router()
router.post("/",authenticate,autihorize(ROLES.Admin,ROLES.Manager),validate(createPropertySchema),propertyController.create)
export default router; 