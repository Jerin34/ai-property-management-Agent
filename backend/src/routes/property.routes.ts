import {Router} from 'express'
import authenticate from '../middleware/auth.middileware.js'
import {validate} from '../middleware/validator.middleware.js'
import {autihorize} from '../middleware/role.middleware.js'
import {ROLES} from '../constants/roles.js'
import {createPropertySchema,updatePropertySchema} from  '../validator/property.validator.js'
import * as propertyController from '../controllers/property.controller.js'
const router = Router()
router.post("/",authenticate,autihorize(ROLES.Admin,ROLES.Manager),validate(createPropertySchema),propertyController.create)
router.patch("/:id/deactivate",authenticate,autihorize(ROLES.Admin,ROLES.Manager),propertyController.deactivateProperty)
router.get("/my",authenticate,autihorize(ROLES.Admin,ROLES.Manager),propertyController.getProperties)
router.get(
    "/:id",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    propertyController.getPropertyById
);
router.patch("/:id",authenticate,autihorize(ROLES.Admin,ROLES.Manager),validate(updatePropertySchema),propertyController.updateProperty)

export default router; 