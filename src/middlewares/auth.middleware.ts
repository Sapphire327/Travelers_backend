import { TokenService } from "@/auth/token.service"
import ApiError from "@/exceptions/api-error"
import { MyUserRequest } from "@/types"
import { NextFunction, Response } from 'express'

export const authMiddleware = async (req: MyUserRequest, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) { return next(ApiError.UnauthorizedError()) }
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) { return next(ApiError.UnauthorizedError()) }
        const tokenService = new TokenService()
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData as tokenPayload
        next()
    } catch (err) {
        throw next(ApiError.UnauthorizedError())
    }
}