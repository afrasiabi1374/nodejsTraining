import {getEnv, log, sleep, toJSON} from '../core/utils.mjs'
import Redis from '../core/redis.mjs'
class EmailService
{
    #redis = null
    constructor()
    {
        log('email service is start ...***********************')
    }    

    async run(){
        this.#redis = new Redis()
        // مقدارش بولی هست 
        const redisStatus =  await this.#redis.connect(getEnv('REDIS_URI'));
        if(!redisStatus)
        {
            log('Redis Can not Connect');
            process.exit(-1);
        }
        
        // ران هیچ وقت تموم نمیشه چون لوپ همیشه داره خودشو صدا میزنه
        await this.loop()
    }

    async loop(){
        // تابع لوپ یه جور تابع رکرسیو هست که خودشو صدا میزنه
        try {
            // log('loop is call')
            // //ردیس دومی آبجکتیه که به آی او ردیس اشاره میکنه  
            const item = await this.#redis.redis.lpop("email_list")

            if (item) {
                const data = await toJSON(item)
                log(data)
                await sleep(data?.sleep)
                log(`send mail to ${data?.email}`)
            }
            await this.loop()
        } catch (e) {
            log(e.tostring())
        }
    }
     
}
async function main(){
    try {
        const Object = new EmailService()
        await Object.run()
    } catch (e) {
        log(`email service ERROR ON : ${e.toString()}`)
    }
}
main()
