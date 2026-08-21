import User from '../models/user.model.js';
import type {UpdateUserRoleInput} from '../validator/user.validator.js'
export const updateUserRole = async(userId:string,data:UpdateUserRoleInput) =>{
    const user = await User.findByIdAndUpdate(
        userId,
        {
            role:data.role,
        },
        {
            new:true,
            runValidators:true
        }
    );
    if(!user){
        throw new Error('No User Found')
    }
    return user;
};