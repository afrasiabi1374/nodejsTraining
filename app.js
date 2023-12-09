import Application from "./application.mjs";
import {log} from './core/utils.mjs';
async function main()
{
    try{
        const app = new Application()
        await  app.run();
    }
    catch(e){
        log(`Error on : main ${e.toString()}`);
    }
}


main();