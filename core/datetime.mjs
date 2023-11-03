import momentTimeZone from "moment-timezone";
import moment from "moment";
import momentJalaali from 'moment-jalaali';
import {getEnv} from './utils.mjs';

class DateTime
{

    #timeZone = null;
    constructor()
    {
        this.#timeZone = getEnv('TIME_ZONE');
    }

    getTimeStamp()
    {
        try{
            return moment.tz(this.#timeZone).unix();
        }
        catch(e){
            return 0;
        }
    }

    toString(format = 'YYYY-MM-DD HH:mm:ss')
    {
        try{
            return moment.tz(this.#timeZone).format(format);
        }
        catch(e){
            return '';
        }
    }

    toDateTime(dateTime = '')
    {
        try{
            return (dateTime === '') ? moment.tz(this.#timeZone) : moment.tz(dateTime,this.#timeZone);
        }
        catch(e){
            return null;
        }
    }


    toJalaali(str,format = 'jYYYY-jMM-jDD')
    {
        try{
            return momentJalaali(str).format(format);
        }
        catch(e){
            return '';
        }
    }

    toGregorian(str,format = 'YYYY-MM-DD')
    {
        try{
            return momentJalaali(str,'jYYYY-jMM-jDD').format(format);
        }
        catch(e){
            return '';
        }
    }


}


export default new DateTime();