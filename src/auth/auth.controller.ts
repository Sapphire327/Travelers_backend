import {NextFunction, Request, Response, Router} from "express";
import {AuthService} from "@/auth/auth.service";
import {body} from "express-validator";
import {createQuoteDTO} from "@/quotes/quote.dto";
import {userLoginDTO} from "@/auth/models/userLogin.dto";
import ApiError from "@/exceptions/api-error";
import {authMiddleware} from "@/middlewares/auth.middleware";
const service = new AuthService();
const authRouter = Router()

authRouter.post('/login',async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = userLoginDTO.safeParse(req.body)
        if(!validation.success) {
            return next(ApiError.BadRequest('',[]))
        }
        const{login,password}=req.body
        const userData = await service.login(login,password)
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        res.json({login:userData.login,isAdmin:userData.isAdmin,accessToken:userData.accessToken})
    }catch (e){
        next(e)
    }
})
authRouter.post('/logout',async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const {refreshToken}=req.cookies;
        await service.logout(refreshToken)
        res.clearCookie('refreshToken')
        res.json('')
    }catch (e){
        next(e)
    }
})
authRouter.get('/refresh',async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const {refreshToken} = req.cookies;
        const userData = await service.refresh(refreshToken)
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        res.json({login:userData.login,isAdmin:userData.isAdmin,accessToken:userData.accessToken})
    }catch (e){
        next(e)
    }
})
authRouter.get('/test',authMiddleware,async(req, res, next)=>{
    const r = await service.test()
    res.json(r)
})

export default authRouter