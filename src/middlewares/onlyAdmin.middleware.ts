import ApiError from "@/exceptions/api-error"
import { MyUserRequest } from "@/types"
import { NextFunction, Response } from 'express'

export const onlyAdminMiddleware = async (req: MyUserRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) { return next(ApiError.UnauthorizedError()) }
        if (!user.isAdmin) { return next(ApiError.ForbiddenError()) }
        next()
    } catch (err) {
        throw next(ApiError.UnauthorizedError())
    }
}