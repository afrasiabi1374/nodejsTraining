import BaseMiddleware from "../core/BaseMiddleware.mjs";
import { log, getEnv } from "../core/utils.mjs";
import expressSession from 'express-session'

class SessionMiddleware extends BaseMiddleware{

    constructor(){
        super()
    }

    handle(req,res,next){
            try{
                expressSession({
                    secret: getEnv('SESSION_SECRET'),
                    name: getEnv('SESSION_NAME'),
                    resave: false,
                    saveUninitialized: true,
                    cookie: { 
                        httpOnly: true,
                        secure: getEnv('SESSION_SECURE', 'bool'),
                        maxAge:  1000*60*getEnv('SESSION_EXPIRE', 'number'),
                        sameSite: getEnv('SESSION_SAMESITE')
                    }
                })(req, res, next)
            }
            catch(e){
                return super.toError(e,req,res)
            }
        }
}

export default SessionMiddleware