import mongoose from 'mongoose'
import UserSchema from './../schemas/user.js'
import { log } from '../core/utils.mjs'
import datetime from '../core/datetime.mjs'
import { MongoDB } from '../global.mjs'

class UserModel
{
    constructor(){
        this.model = MongoDB.db.model('user', UserSchema)
    }

    async register(email, password){
        const data = {
            "email": email,
            "password": password,
            "register_date_time": datetime.toString()
        }
        const row = new this.model(data)
        const result = await row.save()
        log(result?._id)
    }
}
export default UserModel