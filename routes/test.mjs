import { Router } from "express";
import TestController from "../controllers/TestController.mjs";
import { log } from "../core/utils.mjs";

export default  () => {
    const route = Router();
    try{
        route.get('/',TestController.index);
    }
    catch(e){
         log('error in test.mjs')
       route.use(TestController.errorHandling(e.toString()));
    }
    return route
}