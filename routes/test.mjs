import { Router } from "express";
import TestController from "../controllers/TestController.mjs";
const route = Router();

try{
    route.get('/',TestController.index);
}
catch(e){
   route.use(TestController.errorHandling(e.toString()));
}

export default route;