import { Router } from "express";
import userRoute from './user.mjs';
import testRoute from './test.mjs';
import { log } from "../core/utils.mjs";
export default () =>
{
    // try {  
        const route = Router()
        route.use('/', userRoute())
        route.use('/test', testRoute())
        return route
    // } catch (e) {
    //     log('err in route.mjs =>>>>>>>'+ e)
    // }
}