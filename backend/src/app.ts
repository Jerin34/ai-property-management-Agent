import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
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
export default app