import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import propertyRoutes from './routes/property.routes.js'

import maintenanceRoutes from './routes/maintenance.routes.js'
import maintenanceUpdateRoutes from './routes/maintenance-update.routes.js'
import maintenanceCostRoutes from './routes/maintenance_cost.routes.js'
import tenantMaintenanceHistoryRoutes from './routes/maintenance_history.routes.js'
import MaintenanceCostAnalytics from './routes/maintenance-cost-analytics.routes.js'
import MaintenanceSLA from './routes/maintenance_sla.routes.js'
import MaintenanceCostPrediction  from './routes/maintenance_cost_prediction.routes.js'

import maintenanceSchedulerRoutes from './routes/maintenance_scheduler.routes.js'
import maintenanaceEscalaltion from './routes/maintenance_escaltion.routes.js'
import maintenanceAnalyticsRoutes from './routes/maintenance-analytics.routes.js'

import notificationsRoutes from './routes/notification.routes.js'
import notificationPreferencesRoutes from './routes/notification_preferences.routes.js'


const app = express()


// ==================================================
// GLOBAL MIDDLEWARE
// ==================================================

app.use(cors())
app.use(helmet())
app.use(express.json())


// ==================================================
// HEALTH CHECK
// ==================================================

app.get('/', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'AI Property Management Agent is Working'
    })

})


// ==================================================
// AUTHENTICATION
// ==================================================

app.use(
    '/api/auth',
    authRoutes
)


// ==================================================
// USERS & PROPERTIES
// ==================================================

app.use(
    '/api/users',
    userRoutes
)

app.use(
    '/api/properties',
    propertyRoutes
)


// ==================================================
// MAINTENANCE
// ==================================================

// Create / Get / Basic maintenance operations
app.use(
    '/api/maintenance',
    maintenanceRoutes
)
app.use('/api/maintenance_cost', MaintenanceCostAnalytics)

// Update maintenance status
app.use(
    '/api/maintenance',
    maintenanceUpdateRoutes
)

// Update maintenance cost
app.use(
    '/api/maintenance',
    maintenanceCostRoutes
)
//cost analytics

// ==================================================
// TENANT MAINTENANCE
// ==================================================

app.use(
    '/api/tenant-maintenance',
    tenantMaintenanceHistoryRoutes
)


// ==================================================
// PREVENTIVE MAINTENANCE
// ==================================================

app.use(
    '/api/maintenance_schedules',
    maintenanceSchedulerRoutes
)


// ==================================================
// MAINTENANCE ESCALATION
// ==================================================

app.use(
    '/api/maintenance_escalation',
    maintenanaceEscalaltion
)

// ==================================================
// MAINTENANCE SLA
// ==================================================
app.use('/api/maintenance_sla', MaintenanceSLA)

//=================================================
// MAINTENANCE COST PREDICTION
// ==================================================
app.use(
   "/api/maintenance_cost",MaintenanceCostPrediction
);


// ==================================================
// MAINTENANCE ANALYTICS
// ==================================================

app.use(
    '/api/maintenance_analytics',
    maintenanceAnalyticsRoutes
)


// ==================================================
// NOTIFICATIONS
// ==================================================

app.use(
    '/api/notifications/preferences',
    notificationPreferencesRoutes
)

app.use(
    '/api/notifications',
    notificationsRoutes
)


export default app