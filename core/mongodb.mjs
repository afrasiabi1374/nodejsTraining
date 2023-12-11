import mongoose from 'mongoose'
import { log } from './utils.mjs'
class MongoDB {
    #db = null
    get db (){
        return this.#db
    }
    
    constructor(){

    }
    async connect(URI){
        try {
            this.#db = await mongoose.createConnection(URI).asPromise()
            return true
        } catch (e) {
            log('mongoose error in mongodb.mjs =>>> ' + e.toString())
            return false
        }
    }
}
export default MongoDB