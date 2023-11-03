import autoBind from 'auto-bind';
import { getEnv,log } from './utils.mjs';

export default class BaseController
{
    constructor()
    {
        if(this.constructor === BaseController)
        {
            throw new Error(`BaseController is abstract class!`);
        }
        autoBind(this);
    }

    async toError(error,req,res)
    {
        const debug = getEnv('DEBUG','bool');
        try{
            if(debug)
                return res.status(500).send(error.toString());
            else
                return res.status(500).send('Internal Server Error');
        }
        catch(e){
            if(debug)
                return res.status(500).send(e.toString());
            else
                return res.status(500).send('Internal Server Error');
        }
    }

    errorHandling(error)
    {
        try{
            const debug = getEnv('DEBUG','bool');
            return async (req, res, next) => {
                if(debug)
                    return res.status(500).send(error.toString());
                else
                    return res.status(500).send('Internal Server Error');
            };        
        }
        catch(e){
            throw e;
        }
    }


    input(field)
    {
        try{
            if(!Array.isArray(field))
            {
                if(typeof field === 'string')
                        return field.trim();
                else
                    return '';
            }
            else    
                return '';
        }
        catch(e){
            return '';
        }
    }



}