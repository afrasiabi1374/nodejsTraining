import { Router } from "express";
import UserController from "../controllers/UserController.mjs";
import AuthMiddleware from "../middlewares/auth.mjs";
import { log } from "../core/utils.mjs";
import RateLimit from "../middlewares/RateLimit.mjs";
export default () =>{
    log('xxxxxx-!!!!!!!!')
    const route = Router();
    try{
        route.get('/', new RateLimit('user_login', 10, 60, 60).handle ,new AuthMiddleware().isAuth ,UserController.index);
        route.post('/', new RateLimit('user_login', 10, 60, 60).handle , new AuthMiddleware().isAuth ,UserController.postIndex);
        route.get('/register', new AuthMiddleware().isAuth ,UserController.register);
        route.post('/register', new AuthMiddleware().isAuth ,UserController.postRegister);
        route.get('/recovery', new AuthMiddleware().isAuth ,UserController.recovery);
        route.post('/recovery', new AuthMiddleware().isAuth ,UserController.postRecovery);
        route.get('/profile', new AuthMiddleware().needAuth , UserController.profile);
        route.get('/logout', new AuthMiddleware().needAuth ,UserController.logout);
    
    }
    catch(e){
        log('error in route user.mjs')
       route.use(UserController.errorHandling(e.toString()));
    }
    return route
}