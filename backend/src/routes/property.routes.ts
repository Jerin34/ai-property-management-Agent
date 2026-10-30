import {Router} from 'express'
import authenticate from '../middleware/auth.middileware.js'
import {validate} from '../middleware/validator.middleware.js'
import {autihorize} from '../middleware/role.middleware.js'
import {ROLES} from '../constants/roles.js'
import {createPropertySchema,updatePropertySchema} from  '../validator/property.validator.js'
import * as propertyController from '../controllers/property.controller.js'
import { assignTenantSchema } from '../validator/tenant-property-assignment.validator.js'
const router = Router()
router.post("/",authenticate,autihorize(ROLES.Admin,ROLES.Manager),validate(createPropertySchema),propertyController.create)
router.get("/browse", authenticate, autihorize(ROLES.Tenant), stayRequestController.browseProperties);
router.post("/:id/requests", authenticate, autihorize(ROLES.Tenant), stayRequestController.requestToStay);
router.get("/requests/mine", authenticate, autihorize(ROLES.Tenant), stayRequestController.getMyRequests);
router.get("/requests/manager", authenticate, autihorize(ROLES.Admin, ROLES.Manager), stayRequestController.getRequestsForManager);
router.patch("/requests/:requestId", authenticate, autihorize(ROLES.Admin, ROLES.Manager), stayRequestController.reviewRequest);

router.get(
    "/available",
    authenticate,
    autihorize(ROLES.Tenant),
    propertyController.getAvailablePropertiesList
);
router.get("/my",authenticate,autihorize(ROLES.Admin,ROLES.Manager),propertyController.getProperties)
router.get(
    "/tenants/my",
    authenticate,
    autihorize(ROLES.Tenant),
    propertyController.getMyAssignedProperties
);
router.post(
    "/:id/tenants",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    validate(assignTenantSchema),
    propertyController.assignTenant
);
router.patch(
    "/:id/tenants/:tenantId/end",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    propertyController.endTenantAssignment
);
router.patch("/:id/deactivate",authenticate,autihorize(ROLES.Admin,ROLES.Manager),propertyController.deactivateProperty)
router.patch(
    "/:id/activate",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    propertyController.activateProperty
);
router.get(
    "/:id",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    propertyController.getPropertyById
);   
router.get(
    "/:id/copilot",
    authenticate,
    autihorize(ROLES.Admin, ROLES.Manager),
    propertyController.ManagerCopilot
);
router.get('/:id/health',authenticate,autihorize(ROLES.Admin,ROLES.Manager),propertyController.getPropertyHealth)
router.patch("/:id",authenticate,autihorize(ROLES.Admin,ROLES.Manager),validate(updatePropertySchema),propertyController.updateProperty)

export default router; 