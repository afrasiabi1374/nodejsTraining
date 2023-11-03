import {getEnv, log, sleep, toJSON} from './../core/utils.mjs'
import Redis from '../core/redis.mjs'
class EmailService
{
    #redis = null
    #redis2 = null
    constructor()
    {
        log('email service is start ...***********************')
    }    

    async run(){
        this.#redis = new Redis()
        this.#redis2 = new Redis()
        // مقدارش بولی هست 
        const redisStatus =  await this.#redis.connect(getEnv('REDIS_URI'));
        if(!redisStatus)
        {
            log('Redis Can not Connect');
            process.exit(-1);
        }
        const redisStatus2 =  await this.#redis2.connect(getEnv('REDIS_URI'));
        if(!redisStatus2)
        {
            log('Redis2 Can not Connect');
            process.exit(-1);
        }
        // ران هیچ وقت تموم نمیشه چون لوپ همیشه داره خودشو صدا میزنه
        // await this.loop()
        await this.#redis.redis.subscribe("__keyspace@0__:email_list")
        this.#redis.redis.on('message', async(channel, message) => {
            if (message === 'rpush') {
                try {
                    
                    log('from logger channel =>   '+ channel)
                    log('from logger  message =>   '+ message)
                    const item = await this.#redis2.redis.lpop("email_list")
                    // log(item)
                    if (item) {
                        const data = await toJSON(item)
                        log("data =>"+data)
                        await sleep(data?.sleep)
                        log(`send mail to ${data?.email}`)
                    }
                } catch (e) {
                    log(e)
                }
                
            }
        })
    }

    async loop(){
        // تابع لوپ یه جور تابع رکرسیو هست که خودشو صدا میزنه
        try {
            // log('loop is call')
            // //ردیس دومی آبجکتیه که به آی او ردیس اشاره میکنه  
            const item = await this.#redis.redis.lpop("email_list")

            if (item) {
                const data = await toJSON(item)
                // log(data)
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
