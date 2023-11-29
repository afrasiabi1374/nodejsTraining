import { Router } from "express";
import UserController from "../controllers/UserController.mjs";
const route = Router();
try{
    route.get('/',UserController.index);
    route.post('/',UserController.login);
    route.get('/register',UserController.register);
    route.post('/register',UserController.postRegister);
    route.get('/recovery',UserController.recovery);
    route.post('/recovery',UserController.postRecovery);
    route.get('/profile',UserController.profile);

}
catch(e){
   route.use(UserController.errorHandling(e.toString()));
}

export default route;