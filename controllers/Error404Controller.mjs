import BaseController from "../core/BaseController.mjs";
class Error404Controller extends BaseController
{
    constructor()
    {
        super();
    }

    async handle(req,res)
    {
        try{
            return res.status(404).send('404 page not found!');
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default new Error404Controller();