import Redis from "./core/redis.mjs";
import MongoDB from "./core/mongodb.mjs";
const RedisObject = new Redis()
const MongoObject = new MongoDB()
export {
    RedisObject as Redis,
    MongoObject as MongoDB
}