import {NextFunction, Request, Response, Router} from "express";
import ApiError from "@/exceptions/api-error";
import {authMiddleware} from "@/middlewares/auth.middleware";
import {onlyAdminMiddleware} from "@/middlewares/onlyAdmin.middleware";
import {tourCreateDTO, tourEditDTO} from "@/tours/models/tours.dto";
import {ToursService} from "@/tours/tours.service";
const TourRouter = Router()
const tourService = new ToursService()
type FileType = Express.Multer.File;

TourRouter.get('/public',async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    let tours = await tourService.getPublicToursList()
    res.json(tours)
})
TourRouter.get('/public/:tourId',async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const paramsUser = req.params.tourId;
    const tourId = parseInt(paramsUser)
    if(isNaN(tourId)) throw ApiError.BadRequest('tourId is not a number')
    let tours = await tourService.getPublicToursById(tourId)
    res.json(tours)
})
TourRouter.post('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = tourCreateDTO.parse(req.body)
        await tourService.createTour({
            ...validation,
        })
        res.json().status(200)
    }catch (e){
        next(e)
    }
})
TourRouter.put('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const validation = tourEditDTO.parse(req.body)
        await tourService.editTour({
            ...validation
        })
        res.json().status(200)
    }catch (e){
        next(e)
    }
})
TourRouter.delete('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const id = req.body.id
    if(!id)throw ApiError.BadRequest('id не передан')
    await tourService.removeTour(id)
    res.json().status(200)
})
TourRouter.get('/',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    let tours = await tourService.getToursList()
    res.json(tours)
})
TourRouter.get('/:tourId',authMiddleware,onlyAdminMiddleware,async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const paramsUser = req.params.tourId;
    const tourId = parseInt(paramsUser)
    if(isNaN(tourId)) throw ApiError.BadRequest('tourId is not a number')
    let tours = await tourService.getTourById(tourId)
    res.json(tours)
})


export default TourRouter