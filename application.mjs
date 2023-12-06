import {log,getEnv,random} from './core/utils.mjs';
import express from 'express';
import route from './routes/route.mjs';
import nunjucks from 'nunjucks';
import Error500 from './controllers/Error500Controller.mjs';
import Error404 from './controllers/Error404Controller.mjs';
import translate from './core/translate.mjs';
import * as templateHelper from './core/TemplateHelper.mjs';
import { Redis } from './global.mjs';
import TemplateReqMiddleware from './middlewares/template-req.mjs';
import SessionMiddleware from './middlewares/session.mjs';
import FileUploadMiddleware from './middlewares/fileUpload.mjs';

class Application
{
    #app = null;
    #templateEngine = null;
    


    async #initExpress()
    {
        try{
            this.#app = express();
            this.#app.use(express.static('assets'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended:true,limit:'10mb'}));
            this.#app.use(express.json({limit:'10mb'}))
            this.#app.use(new SessionMiddleware().handle)
            this.#app.use(new FileUploadMiddleware().handle)
            this.#app.use(new TemplateReqMiddleware().handle)
            this.#initTemplateEngine();
        }
        catch(e){
            log(`Error on : initExpress ${e.toString()}`);
        }   
    }

    async #initRoute()
    {
        try{
            this.#app.use('/',route());
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
            log(`Error on =>: initTemplateEngine ${e.toString()}`);
        }
    }

    async #init(){
        log(`Application is run!`);
        const redisStatus =  await Redis.connect(getEnv('REDIS_URI'));
        if(!redisStatus)
        {
            log('Redis Can not Connect');
            process.exit(-1);
        }
        await this.#initExpress();
        await this.#initRoute();

        await Redis.ftCreate('user', 'user:', 'id TEXT SORTABLE username TEXT SORTABLE password TEXT SORTABLE')

    }

    async run()
    {
        try{
            await this.#init()
            const result = await Redis.ftSearch('user',  '*','SORTBY id DESC')
            log('result 1 ===>> '+ JSON.stringify(result))
            ////////
            const result2 = await Redis.ftSearch('user', '*', 'LIMIT 0 0')
            log('result 2 ===>> '+ result2)
            ////////
            const result3 = await Redis.ftSearch('user', '*', 'return 1 username')
            log('result 3 ===>> '+ JSON.stringify(result3))
            /////
            const result4 = await Redis.ftSearch('user', '*',
             'return 1 username')
            console.dir('result 4 ===>> '+  JSON.stringify(result4))
            /////
            const result5 = await Redis.ftSearch('user', `
            @username:meisamrce @password:123`,
             'return 1 username')
            log('result 5 ===>> '+ JSON.stringify(result5))


            log(result5)
            const PORT = getEnv('PORT','number');
            this.#app.listen(PORT, '0.0.0.0',async() => {
                log(`app listening on port ${PORT}`);
            });
        }
        catch(e){
            log(`Error on : run ${e.toString()}`);
        }
    }



}


export default new Application();