import {getEnv, log, sleep, toJSON} from './../core/utils.mjs'
import Redis from '../core/redis.mjs'
class RegisterService
{
    #redis = null
    constructor()
    {
        log('RegisterService is start ...***********************')
    }
    
    async run(){
        try {
            this.#redis = new Redis()
            // مقدارش بولی هست 
            const redisStatus =  await this.#redis.connect(getEnv('REDIS_URI'));
            if(!redisStatus)
            {
                log('Redis Can not Connect');
                process.exit(-1);
            }

            this.#redis.redis.on('message', async (a, b) => {
                log(a)
                log(b)
            })
            
        } catch (e) {
            log(`error in run ${e.toString()}`)
        }
    }
}
async function main(){
    try {
        const Object = new RegisterService()
        await Object.run()
    } catch (e) {
        log(`RegisterService ERROR ON : ${e.toString()}`)
    }
}
main()
