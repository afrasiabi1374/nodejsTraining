import BaseMiddleware from "../core/BaseMiddleware.mjs";
import { log, getEnv } from "../core/utils.mjs";
export default class AuthMiddleware extends BaseMiddleware{

    constructor(){
        super()
    }

    needAuth(req,res,next){
        try{
            if (req?.session?.user_id) {
                return next()
            }else{
                return res.redirect(`${getEnv('APP_URL')}?msg=no-access`)
            }
        }
        catch(e){
            log('error in needAuth')
            return super.toError(e,req,res)
        }
    }

    async isAuth(req,res,next){
        try{
            if (req?.session?.user_id) {
                return res.ridirect(`${getEnv('APP_URL')}profile`)
            }else{
                return next()
            }
        }
        catch(e){
            log('error in isAuth')
            return super.toError(e,req,res)
        }
    }
}

