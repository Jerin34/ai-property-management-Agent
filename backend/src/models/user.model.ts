import mongoose,{Schema } from "mongoose";
import type {Role} from '../constants/roles.js'
import {ROLES} from '../constants/roles.js'
export interface IUser{
    name:string;
    email:string;
    password:string;
    phone?:string;
    role:Role;
    avatar?:string,
    isActive:boolean
}
const  userSchema  =  new Schema<IUser>({
name:{
    type:String,
    required:true,
    trim:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},
password:{
    type:String,
    required:true,
    minlength:6,
    select:false
},
phone:{
    type:String,
    trim:true,
},
role:{
    type:String,
    enum:Object.values(ROLES),
    default:ROLES.Tenant
},
avatar:{
    type:String,
    trim:true,
},
isActive:{
    type:Boolean,
    default:true
}
},
{
    timestamps:true
})
const User = mongoose.model<IUser>('User',userSchema)
export default User;