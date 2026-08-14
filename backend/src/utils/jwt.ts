import jwt from "jsonwebtoken";
import type {Role} from '../constants/roles.js'
import env from '../config/env.js'
export interface jwtPayload{
    userId:string,
    role:Role
}
export const generateWebToken = (payload: jwtPayload):string=>{
    return jwt.sign(payload,env.JWT_SECRET,{
        expiresIn:'7d',
    });
};
