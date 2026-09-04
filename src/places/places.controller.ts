import ApiError from "@/exceptions/api-error"
import { upload, prepareFiles } from "@/imageUploader/imageUploader"
import { authMiddleware } from "@/middlewares/auth.middleware"
import { onlyAdminMiddleware } from "@/middlewares/onlyAdmin.middleware"
import { placeCreateDTO, placeEditDTO } from "@/places/models/places.dto"
import { PlaceService } from "@/places/places.service"
import { NextFunction, Request, Response, Router } from "express"

const PlaceRouter = Router()
const placeService = new PlaceService()

PlaceRouter.post('/', authMiddleware, onlyAdminMiddleware, [upload.fields([{ name: 'preview' }, { name: 'images' }])], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { preview, images } = prepareFiles(req)
        const validation = placeCreateDTO.parse(req.body)
        await placeService.createPlace({
            ...validation,
            images: images,
            preview: preview
        })
        res.status(200).json()
    } catch (e) {
        next(e)
    }
})

PlaceRouter.put('/', authMiddleware, onlyAdminMiddleware, [upload.fields([{ name: 'preview' }, { name: 'images' }])], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { preview, images } = prepareFiles(req)
        const validation = placeEditDTO.parse(req.body)
        await placeService.editPlace({
            ...validation,
            images: images,
            preview: preview,
        })
        res.status(200).json()
    } catch (e) {
        next(e)
    }
})

PlaceRouter.delete('/', authMiddleware, onlyAdminMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.body.id
    if (!id) throw ApiError.BadRequest('id не передан')
    await placeService.removePlace(id)
    res.status(200).json()
})

PlaceRouter.get('/', authMiddleware, onlyAdminMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let places = await placeService.getPlacesList()
    res.json(places)
})

PlaceRouter.get('/:placeId', authMiddleware, onlyAdminMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paramsUser = req.params.placeId
    const placeId = parseInt(paramsUser)
    if (isNaN(placeId)) throw ApiError.BadRequest('placeId is not a number')
    let places = await placeService.getPlaceById(placeId)
    res.json(places)
})

export default PlaceRouter
