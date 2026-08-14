import {Authuser} from './auth.types.js'
declare global{
    namespace Express{
        interface Request{
            user?:Authuser
        }
    }
}
export {};