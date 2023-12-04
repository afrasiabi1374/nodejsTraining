import { Router } from "express";
import UserController from "../controllers/UserController.mjs";
import AuthMiddleware from "../middlewares/auth.mjs";
const route = Router();
try{
    route.get('/', new AuthMiddleware().checkAuth ,UserController.index);
    route.post('/', new AuthMiddleware().checkAuth ,UserController.indexPost);
    route.get('/register',UserController.register);
    route.post('/register',UserController.postRegister);
    route.get('/recovery',UserController.recovery);
    route.post('/recovery',UserController.postRecovery);
    route.get('/profile', new AuthMiddleware().needAuth , UserController.profile);
    route.get('/logout', new AuthMiddleware().needAuth ,UserController.logout);

}
catch(e){
   route.use(UserController.errorHandling(e.toString()));
}

export default route;