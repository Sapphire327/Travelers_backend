import {NextFunction, Request, Response, Router} from "express";
import ApiError from "@/exceptions/api-error";
import {authMiddleware} from "@/middlewares/auth.middleware";
import {onlyAdminMiddleware} from "@/middlewares/onlyAdmin.middleware";
import {
    applicationCreateDTO,
    applicationEditDTO, applicationGetByTourDTO,
    applicationPatchDTO
} from "@/applications/models/applications.dto";
import {ApplicationsService} from "@/applications/applications.service";
const ApplicationRouter = Router()
const applicationService = new ApplicationsService()

ApplicationRouter.post('/',async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = applicationCreateDTO.parse(req.body)
        await applicationService.createApplication({
            ...validation,
        })
        res.json().status(200)
    }catch (e){
        next(e)
    }
})
ApplicationRouter.put('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = applicationEditDTO.parse(req.body)
        await applicationService.editApplication({
            ...validation
        })
        res.json().status(200)
    }catch (e){
        next(e)
    }
})
ApplicationRouter.patch('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = applicationPatchDTO.parse(req.body)
        await applicationService.patchApplication({
            ...validation
        })
        res.json().status(200)
    }catch (e){
        next(e)
    }
})
ApplicationRouter.delete('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const id = req.body.id
    if(!id)throw ApiError.BadRequest('id не передан')
    await applicationService.removeApplication(id)
    res.json().status(200)
})
ApplicationRouter.get('/considering',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const applications = await applicationService.getApplicationsConsideringList()
        res.json(applications).status(200)
    }catch (e){
        next(e)
    }
})
ApplicationRouter.get('/byTourId',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = applicationGetByTourDTO.parse(req.body)
        const applications = await applicationService.getApprovedApplicationsListByTourId(validation.toursId)
        res.json(applications).status(200)

    }catch (e){
        next(e)
    }
})


export default ApplicationRouter