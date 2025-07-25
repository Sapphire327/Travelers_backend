import {NextFunction, Request, Response, Router} from "express";
import {upload} from "@/imageUploader/imageUploader";
import {placeCreateDTO, placeEditDTO} from "@/places/models/places.dto";
import ApiError from "@/exceptions/api-error";
import {PlaceService} from "@/places/places.service";
import {Prisma} from "@/generated/prisma";
import fs from 'fs'
import {ZodError} from "zod";
import {authMiddleware} from "@/middlewares/auth.middleware";
import {onlyAdminMiddleware} from "@/middlewares/onlyAdmin.middleware";
import {body} from "express-validator";
import {th} from "zod/dist/types/v4/locales";
const PlaceRouter = Router()
const placeService = new PlaceService()
type FileType = Express.Multer.File;

function processFiles(req: Request) {
    let preview = null
    let images:string[] = []
    if(req.files && 'preview' in req.files){
        preview = req.files.preview[0].filename
    }
    if(req.files && 'images' in req.files){
        images = req.files.images.map(x=>x.filename)
    }
    return { preview, images };
}
function handleErrorsAndCleanup(req: Request, e: unknown, next: NextFunction) {
    if(req.files && 'preview' in req.files) {
        fs.unlink(req.files.preview[0].path,()=>{})
    }
    if(req.files && 'images' in req.files) {
        req.files.images.forEach((file)=>{
            fs.unlink(file.path,()=>{})
        })
    }
    next(e)

}
PlaceRouter.post('/',authMiddleware,onlyAdminMiddleware,[upload.fields([{name:'preview'},{name:'images'}])],async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const { preview, images } = processFiles(req);
        const validation = placeCreateDTO.parse(req.body)
        await placeService.createPlace({
            ...validation,
            images: images,
            preview: preview
        })
        res.json().status(200)
    }catch (e){
        handleErrorsAndCleanup(req,e,next)
    }
})
PlaceRouter.put('/',authMiddleware,onlyAdminMiddleware,[upload.fields([{name:'preview'},{name:'images'}])],async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const { preview, images } = processFiles(req);
        const validation = placeEditDTO.parse(req.body)
        await placeService.editPlace({
            ...validation,
            images: images,
            preview: preview,
        })
        res.json().status(200)
    }catch (e){
        handleErrorsAndCleanup(req,e,next)
    }
})
PlaceRouter.delete('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const id = req.body.id
    if(!id)throw ApiError.BadRequest('id не передан')
    await placeService.removePlace(id)
    res.json().status(200)
})

PlaceRouter.get('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    let places = await placeService.getPlacesList()
    res.json(places)
})
PlaceRouter.get('/:placeId',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const paramsUser = req.params.placeId;
    const placeId = parseInt(paramsUser)
    if(isNaN(placeId)) throw ApiError.BadRequest('placeId is not a number')
    let places = await placeService.getPlaceById(placeId)
    res.json(places)
})

export default PlaceRouter