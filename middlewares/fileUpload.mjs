import BaseMiddleware from "../core/BaseMiddleware.mjs";
import { log } from "../core/utils.mjs";
import fileUpload from "express-fileupload";

class FileUploadMiddleware extends BaseMiddleware{

    constructor(){
        super()
    }

    handle(req,res,next){
            try{
                fileUpload({
                    useTempFiles : true,
                    tempFileDir : '/tmp/'
                })(req, res, next)
            }
            catch(e){
                return super.toError(e,req,res)
            }
        }
}

export default FileUploadMiddleware