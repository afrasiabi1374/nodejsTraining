import BaseMiddleware from "../core/BaseMiddleware.mjs";
import { log, getEnv } from "../core/utils.mjs";
import expressSession from 'express-session'
import { Redis } from "../global.mjs";
import connectRedis from 'connect-redis'

const RedisStore = connectRedis(expressSession)

export default class SessionMiddleware extends BaseMiddleware{

    constructor(){
        super()
    }

    handle(req,res,next){
            try{
                expressSession({
                    // use session store 
                    store: new RedisStore({client: Redis.redis}),
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
                log(e)
                // return super.toError(e,req,res)
            }
        }
}

