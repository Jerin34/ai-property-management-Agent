import app from './app.js'
// import "dotenv/config";
import dns from 'node:dns'
import env from './config/env.js'
import connectDB from './config/db.js'
dns.setServers(['1.1.1.1','1.0.0.1'])

const startServer = async():Promise<void> =>{
    await connectDB()
    app.listen(env.PORT,()=>{
    console.log(`Server is running on http://localhost:${env.PORT}`)
})
}
startServer()