import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import propertyRoutes from './routes/property.routes.js'
import userRoutes from  './routes/user.routes.js'
import maintenanceRoutes from './routes/maintenance.routes.js' 
import maintenanceSchedulerRoutes from './routes/maintenance_scheduler.routes.js'
import notificationsRoutes from './routes/notification.routes.js'
import maintenanaceEscalaltion from './routes/maintenance_escaltion.routes.js'
import maintenanceAnalyticsRoutes
    from "./routes/maintenance-analytics.routes.js";
import maintenanceUpdateRoutes from './routes/maintenance-update.routes.js'
import tenantMaintenanceHistoryRoutes from './routes/maintenance_history.routes.js'
import notificationPreferencesRoutes from './routes/notification_preferences.routes.js'
const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.get('/',(req,res) =>{
    res.status(200).json({
        success:true,
        message:'Ai Property Managmebnt Agent is Working'
    });
});

app.use('/api/auth',authRoutes)
app.use('/api/properties',propertyRoutes)
app.use('/api/maintenance',maintenanceRoutes)
app.use('/api/users',userRoutes)
app.use("/api/maintenance_analytics",maintenanceAnalyticsRoutes)
app.use('/api/maintenance_schedules',maintenanceSchedulerRoutes)
app.use("/api/maintenance_escalation",maintenanaceEscalaltion)
app.use("/api/tenant-maintenance",tenantMaintenanceHistoryRoutes)
app.use('/api/notifications/preferences',notificationPreferencesRoutes)
app.use("/api/maintenance",maintenanceUpdateRoutes)
app.use("/api/notifications",notificationsRoutes)

export default app