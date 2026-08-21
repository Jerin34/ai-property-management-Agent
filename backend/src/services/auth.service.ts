import bcrypt from 'bcrypt'
import {ROLES} from '../constants/roles.js'
import User from '../models/user.model.js'
import type { loginInput } from '../validator/auth.validator.js'
import type {RegisterInput} from '../validator/auth.validator.js'
import { generateWebToken } from '../utils/jwt.js'
const register = async (data:RegisterInput) => {
    const {name,email,password,phone} = data
    const existingUser = await User.findOne({email})
    if(existingUser) throw new Error('User already exists')
    const hashedPassword = await bcrypt.hash(password,10)
const userData = {
name,
password:hashedPassword,
email,
role:ROLES.Tenant,
isActive:true,
...(phone != undefined && {phone}),
};

const user = await User.create(userData)
const token = generateWebToken({
    userId:user._id.toString(),
    role:user.role,
})
return {
    user:{
    id:user._id.toString(),
    name:user.name,
    email:user.email,
    phone:user.phone,
    role:user.role,
    },
    token,
}

}
export const login = async(data:loginInput) =>{
   const user = await User.findOne({
    email:data.email,
   }).select("+password");

if(!user){
    throw new Error("Invalid email or Password")
}
const isPasswordValid  = await bcrypt.compare(data.password,user.password);
if(!isPasswordValid){
    throw new Error("Invalid email or password")
}
const token  = generateWebToken({
    userId:user._id.toString(),
    role:user.role
})

return{
        user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        ...(user.phone !== undefined && { phone: user.phone }),
        role: user.role,
    },
    token,
};
};
export default {register};