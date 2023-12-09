import { Router } from "express";
import TestController from "../controllers/TestController.mjs";
const testController = new TestController()
const route = Router();

try{
    route.get('/',TestController.index);
}
catch(e){
   route.use(testController.errorHandling(e.toString()));
}

export default route;