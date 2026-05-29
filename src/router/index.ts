import ApplicationRouter from "@/applications/applications.controller"
import authRouter from "@/auth/auth.controller"
import PlaceRouter from "@/places/places.controller"
import TourRouter from "@/tours/tours.controller"
import { Router } from "express"

const router = Router()

router.use('/auth',authRouter)
router.use('/places',PlaceRouter);
router.use('/tours',TourRouter);
router.use('/applications',ApplicationRouter);
export default router