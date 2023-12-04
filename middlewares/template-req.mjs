
import BaseMiddleware from "../core/BaseMiddleware.mjs";
export default class TemplateReqMiddleware extends BaseMiddleware{

    constructor(){
        super()
    }

    handle(req,res,next){
            try{
                req.app.set('req',req);
                next();
            }
            catch(e){
                next();
            }
        
    }
}

