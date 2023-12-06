import BaseController from "../core/BaseController.mjs";
import {validationResult,body} from 'express-validator';
import translate from "../core/translate.mjs";
import {Redis} from './../global.mjs';
import crypto from './../core/crypto.mjs';
import {log, random, stringify} from './../core/utils.mjs';
import datetime from './../core/datetime.mjs';



class UserController extends BaseController
{

    constructor()
    {
        super();
    }

    async index(req,res)
    {
        try{
            const data = {
                "title" : translate.t("user.title")
            };
            return res.render('user/index.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #loginValidation(req){
        await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
        await body('password').not().isEmpty().withMessage("err3").run(req);
        return validationResult(req);   
    }

    async postIndex(req,res){
        try{
            const result = await this.#loginValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`/?msg=${result?.errors[0]?.msg}`);
            }   
            const email = super.input(req.body.email);
            const password = super.input(req.body.password);
            const hashEmail = crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            if(user?.id && password === user?.password)
            {
                req.session.user_id = await user?.id
                return res.redirect(`/profile?id=${user?.id}`);
            }
            else
            {
                return res.redirect("/?msg=login-error");
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async register(req,res)
    {
        try{
            const data = {
                "title" : translate.t("user.register")
            };
            return res.render('user/register.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #registerValidation(req){
        await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
        await body('password1').not().isEmpty().withMessage("err3").run(req);
        await body('password2').not().isEmpty().withMessage("err4").run(req);
        return validationResult(req);
    }

    async postRegister(req,res){
        try{

            const result = await this.#registerValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`/register?msg=${result?.errors[0]?.msg}`);
            }   
            const email = super.input(req.body.email);
            const password1 = super.input(req.body.password1);
            const password2 = super.input(req.body.password2);
            if(password1 !== password2)
            {
                return res.redirect(`/register?msg=err5`);
            }
            const hashEmail = crypto.hash(email);
            const alreadyEmail = await Redis.get(`user_${hashEmail}`);
            if(alreadyEmail === '')
            {
                const data = {
                    "email" : email,
                    "id" : hashEmail,
                    "password" : password2
                };
                await Redis.set(`user_${hashEmail}`, data);
                const userData = {
                    "email": email,
                    "sleep": random(1000,10000)
                }
                // سرویس ایمیل سرویس ران شده باشد
                await Redis.redis.rpush("email_list", stringify(userData))
                // سرویس رجیستر ران شده باشد
                await Redis.redis.publish('news1', `register a new user ${email} ${datetime.toString()}`)
                return res.redirect("/register?msg=ok");
            }
            else
            {
                return res.redirect("/register?msg=already-email");
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async recovery(req,res)
    {
        try{

            const data = {
                "title" : translate.t("user.recovery")
            };
            return res.render('user/recovery.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #recoveryValidation(req){
        await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
        return validationResult(req);   
    }

    async postRecovery(req,res){
        try{

            const result = await this.#recoveryValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`/recovery?msg=${result?.errors[0]?.msg}`);
            }   
            const email = super.input(req.body.email);
            const hashEmail = crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            if(user?.id)
            {
                const resetKey = await Redis.get(`reset_${hashEmail}`);

                if(resetKey === '')
                {
                    const token = crypto.hash(email + random(1000000000,9999999999) + datetime.getTimeStamp() + random(1000000000,9999999999));
                    const data = {
                        "email" : email,
                        "id" : hashEmail,
                        "token" : token
                    };
                    await Redis.set(`reset_${hashEmail}`,data,60 * 2);
                    return res.redirect("/recovery?msg=ok");
    
                }
                else
                {
                    return res.redirect("/recovery?msg=reset-wait");
                }
            }
            else
            {
                return res.redirect("/recovery?msg=email-error");
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async profile(req, res){
        try {
            
            const id = super.input(req.session?.user_id)
            const user = await Redis.get(`user_${id}`)
            let data =  {
                title: "Profile",
                user: user
            }
            return res.render('user/profile.html', data)

        } catch (e) {
            log(e)
            return super.toError(e,req.res)
        }
    }


    async logout(req, res){
        try {
            await delete req?.session?.user_id
            await req.session.destroy()
            return res.redirect("/?msg=logout-sucess")
        } catch (e) {
            log(e)
            return super.toError(e,req.res)
        }
    }

}


export default new UserController();