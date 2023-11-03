import BaseController from "../core/BaseController.mjs";
class Error500Controller extends BaseController
{
    constructor()
    {
        super();
    }

    async handle(error,req,res,next)
    {
        try{
            return super.toError(error,req,res);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default new Error500Controller();