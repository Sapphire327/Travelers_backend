import {NextFunction,Request,Response} from 'express';
import ApiError from "@/exceptions/api-error";
import {TokenService} from "@/auth/token.service";
import {MyUserRequest} from "@/types";

export const authMiddleware = async(req: MyUserRequest, res: Response, next: NextFunction)=>{
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){return next(ApiError.UnauthorizedError())}
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){return next(ApiError.UnauthorizedError())}
        const tokenService = new TokenService();
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData as tokenPayload ;
        next()
    }catch(err){
        throw next(ApiError.UnauthorizedError())
    }
}