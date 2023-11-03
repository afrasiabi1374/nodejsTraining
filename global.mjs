import Redis from "./core/redis.mjs";
const RedisObject = new Redis()

export {
    RedisObject as Redis
}