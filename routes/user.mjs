import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.mjs";
import { log } from "../core/utils.mjs";
import RateLimit from "../middlewares/RateLimit.mjs";
import UserController from "../controllers/UserController.mjs";
const userController = new UserController()
const route = Router();
try{
    route.get('/', new RateLimit('user_login', 10, 60, 60).handle ,new AuthMiddleware().isAuth ,userController.index);
    route.post('/', new RateLimit('user_login', 10, 60, 60).handle , new AuthMiddleware().isAuth ,userController.postIndex);
    route.get('/register', new AuthMiddleware().isAuth ,userController.register);
    route.post('/register', new AuthMiddleware().isAuth ,userController.postRegister);
    route.get('/recovery', new AuthMiddleware().isAuth ,userController.recovery);
    route.post('/recovery', new AuthMiddleware().isAuth ,userController.postRecovery);
    route.get('/profile', new AuthMiddleware().needAuth , userController.profile);
    route.get('/logout', new AuthMiddleware().needAuth ,userController.logout);

}
catch(e){
    log('error in route user.mjs')
    route.use(UserController.errorHandling(e.toString()));
}

export default route