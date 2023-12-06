import BaseMiddleware from "../core/BaseMiddleware.mjs";
import { log } from "../core/utils.mjs";
import { Redis } from "../global.mjs";
import {RateLimiterRedis} from 'rate-limiter-flexible';
export default class RateLimit extends BaseMiddleware {
    #rateLimiter = null;
    constructor(key, numberOfRequests, durationSecond, blockDurationSecond = 60)
    {

        super()
        const config = {
            storeClient: Redis.redis,
            keyPrefix: key,
            points: numberOfRequests, // number of points -> requests
            duration: durationSecond, // Per seconds by IP
        };
        this.#rateLimiter = new RateLimiterRedis(config)

    }

    async handle(req, res, next) {
        try {
            // consume is ratelimit function
            // male khode package
            this.#rateLimiter.consume(req.ip)
            .then(() => {
                next()
            }).catch((err) => {
                res.status(429).send('tedad darkhast ziyad ast!!!')
            });
            
        } catch (e) {
            return super.toError(e, req, res)
        }
    }
}
