import ioredis, {Command} from 'ioredis';
import { log, toNumber, stringify, isJSON, toJSON, sleep } from './utils.mjs';

class Redis
{
    #URI = null;
    #redis = null;

    get redis()
    {
        return this.#redis;
    }

    async connect(URI)
    {
        try{
            this.#URI = URI;
            this.#redis = new ioredis(this.#URI,{lazyConnect:true});
            await this.#redis.connect();  
            return true;
        }
        catch(e){
            return false;
        }
    }


    async set(key,data = {},ex=0)
    {
        try{
            data = (typeof data === 'string') ? data : stringify(data); 
            ex = toNumber(ex) > 0 ? ex : 0;
            if(ex > 0)  
                await this.#redis.set(key,data,"EX",ex);
            else
                await this.#redis.set(key,data);
        }
        catch(e){
            return false;
        }
    }

    async get(key)
    {
        try{
            const result = await this.#redis.get(key);
            if(result)
            {
                return isJSON(result) ? toJSON(result) : result;
            }
            else    
                return '';
        }
        catch(e){
            return '';
        }
    }


    async del(key)
    {
        try{
            await this.#redis.del(key);
            return true;
        }
        catch(e){
            return false;
        }
    }

    async keys(pattern){
        try{
            return await this.#redis.keys(pattern);
        }
        catch(e)
        {
            return [];
        }
    }

    async setHash(key,data={},ex=0)
    {
        try{
            ex = toNumber(ex) > 0 ? ex : 0;
            await this.#redis.hset(key,data);
            if(ex > 0)
                await this.#redis.expire(key,ex);
            return true;
        }
        catch(e){
            return false;
        }
    }   


    async getHash(key)
    {
        try{
            return await this.#redis.hgetall(key);
        }
        catch(e){
            return {};
        }
    } 


    async delHash(key,...fields)
    {
        try{
            await this.#redis.hdel(key,fields);
            return true;
        }
        catch(e){
            return false;
        }
    } 


    
    async ftCreate(indexName, keySpace, schema=''){
        try {
            const cmd = new sendCommand('FT.CREATE',
            [indexName, 'ON', 'HASH', 'PREFIX', 1, keySpace, 'SCHEMA', schema.split(' '), 'utf-8'])
            await this.#redis.sendCommand(cmd)
            return true
        } catch (e) {
            log(e)
            return false
        }
    }

}

export default Redis
