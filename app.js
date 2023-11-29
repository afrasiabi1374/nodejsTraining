import application from "./application.mjs";
import {log} from './core/utils.mjs';
async function main()
{
    try{
        await application.run();
    }
    catch(e){
        log(`Error on : main ${e.toString()}`);
    }
}


main();