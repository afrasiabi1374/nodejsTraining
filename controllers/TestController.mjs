import BaseController from "../core/BaseController.mjs";
import { Redis } from "../global.mjs";
 
const states = [
    
    {
        "id":1, "title": "A"
    },
    {
        "id":2, "title": "B"
    },    
    {
        "id":3, "title": "C"
    },
    {
        "id":4, "title": "D"
    },    
    {
        "id":5, "title": "E"
    },
    {
        "id":6, "title": "F"
    },
    {
        "id":7, "title": "G"
    },
    {
        "id":8, "title": "H"
    }
]


class TestController extends BaseController
{

    constructor()
    {
        super();
    }

    async index(req,res)
    {
        try{
            const cacheState = await Redis.get('state_cache')
            if (cacheState) {
                return res.json([])
            }else{
                await Redis.set("state_cache", states)
                return res.json(states)
            }
            return res.json([])
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

}


export default new TestController();