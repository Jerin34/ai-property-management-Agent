import mongoose from "mongoose";
import env from "./env.js";
const connectDB = async(): Promise<void> =>{
try{
    await mongoose.connect(env.MONGODB_URI)
    console.log('MongoDb Connected SuccessFully')
}
catch(err){
    console.log('Connection Failed',err)
    process.exit(1)
}
}
export default connectDB