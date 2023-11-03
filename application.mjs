import {log,getEnv,random} from './core/utils.mjs';
import express from 'express';
import fileUpload from 'express-fileupload';
import route from './routes/route.mjs';
import nunjucks from 'nunjucks';
import Error500 from './controllers/Error500Controller.mjs';
import Error404 from './controllers/Error404Controller.mjs';
import translate from './core/translate.mjs';
import * as templateHelper from './core/TemplateHelper.mjs';
import { Redis } from './global.mjs';
class Application
{
    #app = null;
    #templateEngine = null;
    
    constructor()
    {
        this.#initExpress();
        this.#initRoute();
    }

    async #initExpress()
    {
        try{
            this.#app = express();
            this.#app.use(express.static('assets'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended:true,limit:'10mb'}));
            this.#app.use(express.json({limit:'10mb'}));
            this.#app.use(fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/'
            }));
            this.#app.use(async (req,res,next) => {
                try{
                    this.#app.set('req',req);
                    next();
                }
                catch(e){
                    next();
                }
            });
            this.#initTemplateEngine();
        }
        catch(e){
            log(`Error on : initExpress ${e.toString()}`);
        }   
    }

    async #initRoute()
    {
        try{
            this.#app.use('/',route);
            this.#app.use(Error404.handle);
            this.#app.use(Error500.handle);        
        }
        catch(e){
            log(`Error on : initRoute ${e.toString()}`);
        }
    }


    #initTemplateEngine(){
        try{
            const templateDir = 'templates/' + getEnv('TEMPLATE') + '/'; 
            this.#templateEngine = nunjucks.configure(templateDir,{
                autoescape : true,
                express : this.#app,
                noCache : false,
            });
            this.#templateEngine.addGlobal('t',translate.t);
            this.#templateEngine.addGlobal('APP_URL',getEnv('APP_URL'));
            this.#templateEngine.addGlobal('TEMPLATE_NAME',getEnv('TEMPLATE')+'/');    
            this.#templateEngine.addExtension('alertDangerExtension',new templateHelper.alertDangerExtension());
            this.#templateEngine.addExtension('alertSuccessExtension',new templateHelper.alertSuccessExtension());
        }
        catch(e){
            log(`Error on : initTemplateEngine ${e.toString()}`);
        }
    }


    async run()
    {
        try{
            log(`Application is run!`);
            const redisStatus =  await Redis.connect(getEnv('REDIS_URI'));
            if(!redisStatus)
            {
                log('Redis Can not Connect');
                process.exit(-1);
            }
    
            const PORT = getEnv('PORT','number');
            this.#app.listen(PORT,async() => {
                log(`app listening on port ${PORT}`);
            });    
        }
        catch(e){
            log(`Error on : run ${e.toString()}`);
        }
    }

}


export default new Application();