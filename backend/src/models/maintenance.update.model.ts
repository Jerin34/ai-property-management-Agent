import mongoose, {Schema,Types} from 'mongoose'

export interface IMaintenanceUpdate{
    maintenance:Schema.Types.ObjectId,
    user:Schema.Types.ObjectId,
    message:string
}
const maintenanceUpdateScheama = new Schema<IMaintenanceUpdate>({
    maintenance:{
        type:Schema.Types.ObjectId,
        ref:"Maintenace",
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true,
        trim:true,
    },
},{
    timestamps:true
})
const MaintenaceUpdate = mongoose.model<IMaintenanceUpdate>(
    "MaintenanceUpate",maintenanceUpdateScheama
);
export default MaintenaceUpdate;